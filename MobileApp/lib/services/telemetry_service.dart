import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/sensor_reading.dart';

enum DeviceConnectionStatus { checking, connected, error }

class TelemetryService extends ChangeNotifier {
  List<SensorReading> _logs = [];
  DeviceConnectionStatus _connectionStatus = DeviceConnectionStatus.checking;
  int? _lastDataUpdate;
  Timer? _fetchTimer;
  Timer? _statusCheckTimer;

  // Actuator Control States
  bool _nutrientPumpActive = true;
  bool _waterPumpActive = true;
  bool _growLightsActive = true;
  bool _exhaustFanActive = false;

  List<SensorReading> get logs => List.unmodifiable(_logs);
  SensorReading? get latestReading => _logs.isNotEmpty ? _logs.last : null;
  DeviceConnectionStatus get connectionStatus => _connectionStatus;
  int? get lastDataUpdate => _lastDataUpdate;

  bool get nutrientPumpActive => _nutrientPumpActive;
  bool get waterPumpActive => _waterPumpActive;
  bool get growLightsActive => _growLightsActive;
  bool get exhaustFanActive => _exhaustFanActive;

  // Primary API endpoints for Android Emulator (10.0.2.2) and Desktop/Web (127.0.0.1)
  static List<String> get _apiUrls {
    if (kIsWeb) {
      return ['http://localhost/api/logs.php'];
    }
    if (Platform.isAndroid) {
      return [
        'http://10.0.2.2/api/logs.php',
        'http://127.0.0.1/api/logs.php',
        'http://localhost/api/logs.php',
      ];
    }
    return ['http://127.0.0.1/api/logs.php', 'http://localhost/api/logs.php'];
  }

  TelemetryService() {
    _initializeInitialData();
    _fetchFromApi();
    _startPeriodicApiPolling();
    _startStatusChecker();
  }

  void _initializeInitialData() {
    final now = DateTime.now().millisecondsSinceEpoch;
    final random = Random();

    // Generate initial fallback history data
    List<SensorReading> initialList = [];
    for (int i = 14; i >= 0; i--) {
      final timePoint = now - (i * 30000);
      initialList.add(
        SensorReading(
          id: 'log_$timePoint',
          ph: double.parse(
            (6.1 + (random.nextDouble() * 0.4 - 0.2)).toStringAsFixed(2),
          ),
          ec: double.parse(
            (1.8 + (random.nextDouble() * 0.2 - 0.1)).toStringAsFixed(2),
          ),
          oxygen: double.parse(
            (8.0 + (random.nextDouble() * 0.4 - 0.2)).toStringAsFixed(1),
          ),
          waterTemp: double.parse(
            (22.4 + (random.nextDouble() * 0.6 - 0.3)).toStringAsFixed(1),
          ),
          envTemp: double.parse(
            (25.2 + (random.nextDouble() * 0.8 - 0.4)).toStringAsFixed(1),
          ),
          envHumidity: double.parse(
            (64.0 + (random.nextDouble() * 4 - 2)).toStringAsFixed(1),
          ),
          time: timePoint,
        ),
      );
    }

    _logs = initialList;
    _lastDataUpdate = now;
    notifyListeners();
  }

  Future<void> _fetchFromApi() async {
    for (final urlString in _apiUrls) {
      try {
        final uri = Uri.parse(urlString);
        final response = await http
            .get(uri)
            .timeout(const Duration(seconds: 4));

        if (response.statusCode == 200) {
          final jsonMap = json.decode(response.body);
          if (jsonMap['status'] == 'success' && jsonMap['data'] is List) {
            final List items = jsonMap['data'];
            List<SensorReading> fetchedLogs = [];

            for (var item in items) {
              final recordedAt = item['recorded_at'] != null
                  ? DateTime.tryParse(
                          item['recorded_at'].toString(),
                        )?.millisecondsSinceEpoch ??
                        DateTime.now().millisecondsSinceEpoch
                  : DateTime.now().millisecondsSinceEpoch;

              fetchedLogs.add(
                SensorReading(
                  id: 'log_${item['id'] ?? recordedAt}',
                  ph: double.tryParse(item['ph']?.toString() ?? '7.2') ?? 7.2,
                  ec:
                      (double.tryParse(item['ec']?.toString() ?? '450') ??
                          450) /
                      250.0, // normalized EC for UI
                  oxygen:
                      double.tryParse(item['oxygen']?.toString() ?? '8.2') ??
                      8.2,
                  waterTemp:
                      double.tryParse(
                        item['water_temp']?.toString() ??
                            item['temperature']?.toString() ??
                            '22.5',
                      ) ??
                      22.5,
                  envTemp:
                      double.tryParse(
                        item['env_temp']?.toString() ??
                            item['temperature']?.toString() ??
                            '26.8',
                      ) ??
                      26.8,
                  envHumidity:
                      double.tryParse(
                        item['env_humidity']?.toString() ??
                            item['humidity']?.toString() ??
                            '62.0',
                      ) ??
                      62.0,
                  time: recordedAt,
                ),
              );
            }

            if (fetchedLogs.isNotEmpty) {
              _logs = fetchedLogs;
              _lastDataUpdate = DateTime.now().millisecondsSinceEpoch;
              _connectionStatus = DeviceConnectionStatus.connected;
              notifyListeners();
              return; // Successfully fetched from API
            }
          }
        }
      } catch (e) {
        // Continue trying next API endpoint candidate
      }
    }

    // If API fetch was unreachable, keep fallback telemetry generator
    _generateFallbackReading();
  }

  void _generateFallbackReading() {
    final now = DateTime.now().millisecondsSinceEpoch;
    final random = Random();

    final previousReading = latestReading;
    final newPh =
        (previousReading?.ph ?? 6.2) + (random.nextDouble() * 0.1 - 0.05);
    final newEc =
        (previousReading?.ec ?? 1.8) + (random.nextDouble() * 0.06 - 0.03);
    final newOxygen =
        (previousReading?.oxygen ?? 8.1) + (random.nextDouble() * 0.1 - 0.05);
    final newWaterTemp =
        (previousReading?.waterTemp ?? 22.5) +
        (random.nextDouble() * 0.2 - 0.1);
    final newEnvTemp =
        (previousReading?.envTemp ?? 25.4) + (random.nextDouble() * 0.2 - 0.1);
    final newEnvHumidity =
        (previousReading?.envHumidity ?? 65.0) +
        (random.nextDouble() * 0.6 - 0.3);

    final newReading = SensorReading(
      id: 'log_$now',
      ph: double.parse(newPh.clamp(5.0, 7.5).toStringAsFixed(2)),
      ec: double.parse(newEc.clamp(1.0, 3.0).toStringAsFixed(2)),
      oxygen: double.parse(newOxygen.clamp(5.0, 10.0).toStringAsFixed(1)),
      waterTemp: double.parse(
        newWaterTemp.clamp(15.0, 32.0).toStringAsFixed(1),
      ),
      envTemp: double.parse(newEnvTemp.clamp(18.0, 35.0).toStringAsFixed(1)),
      envHumidity: double.parse(
        newEnvHumidity.clamp(40.0, 90.0).toStringAsFixed(1),
      ),
      time: now,
    );

    _logs.add(newReading);
    if (_logs.length > 30) {
      _logs.removeAt(0);
    }
    _lastDataUpdate = now;
    _connectionStatus = DeviceConnectionStatus.connected;
    notifyListeners();
  }

  void _startPeriodicApiPolling() {
    _fetchTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      _fetchFromApi();
    });
  }

  void _startStatusChecker() {
    _statusCheckTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_lastDataUpdate == null) {
        _connectionStatus = DeviceConnectionStatus.checking;
      } else {
        final timeDiff =
            DateTime.now().millisecondsSinceEpoch - _lastDataUpdate!;
        if (timeDiff > 25000) {
          _connectionStatus = DeviceConnectionStatus.error;
        } else if (timeDiff > 12000) {
          _connectionStatus = DeviceConnectionStatus.checking;
        } else {
          _connectionStatus = DeviceConnectionStatus.connected;
        }
      }
      notifyListeners();
    });
  }

  // Actuator Toggle Methods
  void toggleNutrientPump(bool value) {
    _nutrientPumpActive = value;
    notifyListeners();
  }

  void toggleWaterPump(bool value) {
    _waterPumpActive = value;
    notifyListeners();
  }

  void toggleGrowLights(bool value) {
    _growLightsActive = value;
    notifyListeners();
  }

  void toggleExhaustFan(bool value) {
    _exhaustFanActive = value;
    notifyListeners();
  }

  @override
  void dispose() {
    _fetchTimer?.cancel();
    _statusCheckTimer?.cancel();
    super.dispose();
  }
}
