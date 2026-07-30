import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserModel {
  final String email;
  final String name;
  final String phoneNumber;
  final String deliveryAddress;
  final String billingAddress;
  final DateTime createdAt;

  UserModel({
    required this.email,
    required this.name,
    this.phoneNumber = '',
    this.deliveryAddress = '',
    this.billingAddress = '',
    required this.createdAt,
  });
}

class AuthService extends ChangeNotifier {
  UserModel? _currentUser;
  bool _isLoading = true;
  String? _errorMessage;

  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthService() {
    _loadSession();
  }

  // Validation Helpers
  static bool isValidEmail(String email) {
    final cleanEmail = email.trim();
    // Disallow illegal characters like { } [ ] " ' \ < >
    if (RegExp(r'[\{\}\[\]"\\<>\s]').hasMatch(cleanEmail)) {
      return false;
    }
    final emailRegex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return emailRegex.hasMatch(cleanEmail);
  }

  static bool hasMinLength(String password) => password.length >= 6;
  static bool hasUppercase(String password) => RegExp(r'[A-Z]').hasMatch(password);
  static bool hasSpecialChar(String password) => RegExp(r'[!@#$%^&*(),.?":{}|_+\-=\[\]\\/<>]').hasMatch(password);

  static bool isValidPassword(String password) {
    return hasMinLength(password) && hasUppercase(password) && hasSpecialChar(password);
  }

  Future<void> _loadSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userEmail = prefs.getString('user_email');
      final userName = prefs.getString('user_name');
      final userPhone = prefs.getString('user_phone') ?? '';
      final deliveryAddress = prefs.getString('delivery_address') ?? '';
      final billingAddress = prefs.getString('billing_address') ?? '';

      // Ensure seed default user is pre-registered
      final registeredJson = prefs.getString('registered_users_db');
      if (registeredJson == null) {
        final initialUsers = {
          'customer@gravity.io': {
            'email': 'customer@gravity.io',
            'name': 'Green Horizon Farm',
            'password': 'Customer@123',
            'phone': '+94 77 123 4567',
          }
        };
        await prefs.setString('registered_users_db', json.encode(initialUsers));
      }

      if (userEmail != null && userEmail.isNotEmpty) {
        _currentUser = UserModel(
          email: userEmail,
          name: userName ?? 'Customer',
          phoneNumber: userPhone,
          deliveryAddress: deliveryAddress,
          billingAddress: billingAddress,
          createdAt: DateTime.now(),
        );
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error loading auth session: $e');
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 600));

    final cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      _errorMessage = 'Invalid email address. Please check email syntax and remove illegal characters.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (password.isEmpty) {
      _errorMessage = 'Please enter your password.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    final prefs = await SharedPreferences.getInstance();
    final registeredJson = prefs.getString('registered_users_db');
    Map<String, dynamic> registeredUsers = {};

    if (registeredJson != null) {
      try {
        registeredUsers = json.decode(registeredJson);
      } catch (_) {}
    }

    // Enforce Registration Requirement
    if (!registeredUsers.containsKey(cleanEmail)) {
      _errorMessage = 'Account not registered. New customers must create an account first.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    final userData = registeredUsers[cleanEmail];
    final savedPassword = userData['password'] ?? '';

    if (savedPassword.isNotEmpty && savedPassword != password) {
      _errorMessage = 'Incorrect password. Please verify your credentials.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    final savedName = userData['name'] ?? 'Customer';
    final savedPhone = userData['phone'] ?? (prefs.getString('user_phone') ?? '');
    final savedDelivery = prefs.getString('delivery_address') ?? '';
    final savedBilling = prefs.getString('billing_address') ?? '';

    _currentUser = UserModel(
      email: cleanEmail,
      name: savedName,
      phoneNumber: savedPhone,
      deliveryAddress: savedDelivery,
      billingAddress: savedBilling,
      createdAt: DateTime.now(),
    );

    await prefs.setString('user_email', _currentUser!.email);
    await prefs.setString('user_name', _currentUser!.name);

    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<bool> register(String email, String password, String name) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 600));

    final cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      _errorMessage = 'Invalid email format. Email cannot contain spaces or special brackets { } [ ] " \' \\';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (name.trim().isEmpty) {
      _errorMessage = 'Please enter your full name.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (!isValidPassword(password)) {
      _errorMessage = 'Password must be at least 6 characters and contain at least 1 Capital Letter (A-Z) and 1 Special Character (!@#\$...).';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    final prefs = await SharedPreferences.getInstance();
    final registeredJson = prefs.getString('registered_users_db');
    Map<String, dynamic> registeredUsers = {};

    if (registeredJson != null) {
      try {
        registeredUsers = json.decode(registeredJson);
      } catch (_) {}
    }

    if (registeredUsers.containsKey(cleanEmail)) {
      _errorMessage = 'An account with this email already exists. Please log in.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    // Save new registered account
    registeredUsers[cleanEmail] = {
      'email': cleanEmail,
      'name': name.trim(),
      'password': password,
      'registeredAt': DateTime.now().toIso8601String(),
    };

    await prefs.setString('registered_users_db', json.encode(registeredUsers));

    _currentUser = UserModel(
      email: cleanEmail,
      name: name.trim(),
      phoneNumber: '',
      deliveryAddress: '',
      billingAddress: '',
      createdAt: DateTime.now(),
    );

    await prefs.setString('user_email', _currentUser!.email);
    await prefs.setString('user_name', _currentUser!.name);

    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<void> updateProfile({
    String? name,
    String? phoneNumber,
    String? deliveryAddress,
    String? billingAddress,
  }) async {
    if (_currentUser == null) return;

    _currentUser = UserModel(
      email: _currentUser!.email,
      name: name?.trim() ?? _currentUser!.name,
      phoneNumber: phoneNumber?.trim() ?? _currentUser!.phoneNumber,
      deliveryAddress: deliveryAddress?.trim() ?? _currentUser!.deliveryAddress,
      billingAddress: billingAddress?.trim() ?? _currentUser!.billingAddress,
      createdAt: _currentUser!.createdAt,
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_name', _currentUser!.name);
    await prefs.setString('user_phone', _currentUser!.phoneNumber);
    await prefs.setString('delivery_address', _currentUser!.deliveryAddress);
    await prefs.setString('billing_address', _currentUser!.billingAddress);

    notifyListeners();
  }

  Future<void> logout() async {
    _currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_email');
    await prefs.remove('user_name');
    await prefs.remove('user_phone');
    await prefs.remove('delivery_address');
    await prefs.remove('billing_address');
    notifyListeners();
  }
}
