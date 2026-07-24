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

  Future<void> _loadSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userEmail = prefs.getString('user_email');
      final userName = prefs.getString('user_name');
      final userPhone = prefs.getString('user_phone') ?? '';
      final deliveryAddress = prefs.getString('delivery_address') ?? '';
      final billingAddress = prefs.getString('billing_address') ?? '';

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

    await Future.delayed(const Duration(milliseconds: 900)); // Simulate network request

    final cleanEmail = email.trim();
    final emailParts = cleanEmail.split('@');

    if (cleanEmail.isEmpty || emailParts.length != 2 || emailParts[0].isEmpty || emailParts[1].isEmpty) {
      _errorMessage = 'Please enter a valid email address';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (password.length < 6) {
      _errorMessage = 'Password must be at least 6 characters';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    final prefs = await SharedPreferences.getInstance();
    final savedPhone = prefs.getString('user_phone') ?? '';
    final savedDelivery = prefs.getString('delivery_address') ?? '';
    final savedBilling = prefs.getString('billing_address') ?? '';

    final rawName = emailParts[0];
    final formattedName = rawName.isNotEmpty
        ? rawName[0].toUpperCase() + rawName.substring(1)
        : 'Customer';

    _currentUser = UserModel(
      email: cleanEmail,
      name: formattedName,
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

    await Future.delayed(const Duration(milliseconds: 900));

    final cleanEmail = email.trim();
    final emailParts = cleanEmail.split('@');

    if (cleanEmail.isEmpty || emailParts.length != 2 || emailParts[0].isEmpty || emailParts[1].isEmpty) {
      _errorMessage = 'Please enter a valid email address';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (password.length < 6) {
      _errorMessage = 'Password must be at least 6 characters';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (name.trim().isEmpty) {
      _errorMessage = 'Please enter your name';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    _currentUser = UserModel(
      email: cleanEmail,
      name: name.trim(),
      phoneNumber: '',
      deliveryAddress: '',
      billingAddress: '',
      createdAt: DateTime.now(),
    );

    final prefs = await SharedPreferences.getInstance();
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
