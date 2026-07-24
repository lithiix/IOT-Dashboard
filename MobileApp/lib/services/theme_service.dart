import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppThemeMode { system, light, dark }

class ThemeService extends ChangeNotifier {
  static const String _themePrefKey = 'app_theme_mode';
  AppThemeMode _appThemeMode = AppThemeMode.system;

  AppThemeMode get appThemeMode => _appThemeMode;

  ThemeMode get themeMode {
    switch (_appThemeMode) {
      case AppThemeMode.light:
        return ThemeMode.light;
      case AppThemeMode.dark:
        return ThemeMode.dark;
      case AppThemeMode.system:
        return ThemeMode.system;
    }
  }

  ThemeService() {
    _loadThemePreference();
  }

  Future<void> _loadThemePreference() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedMode = prefs.getString(_themePrefKey);
      if (savedMode == 'light') {
        _appThemeMode = AppThemeMode.light;
      } else if (savedMode == 'dark') {
        _appThemeMode = AppThemeMode.dark;
      } else {
        _appThemeMode = AppThemeMode.system;
      }
    } catch (_) {
      _appThemeMode = AppThemeMode.system;
    }
    notifyListeners();
  }

  Future<void> setThemeMode(AppThemeMode mode) async {
    _appThemeMode = mode;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      if (mode == AppThemeMode.light) {
        await prefs.setString(_themePrefKey, 'light');
      } else if (mode == AppThemeMode.dark) {
        await prefs.setString(_themePrefKey, 'dark');
      } else {
        await prefs.setString(_themePrefKey, 'system');
      }
    } catch (_) {}
  }
}
