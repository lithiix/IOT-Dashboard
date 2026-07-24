import 'dart:async';
import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/sensor_reading.dart';

enum DeviceConnectionStatus { checking, connected, error }

class TelemetryService extends ChangeNotifier {
  List<SensorReading> _logs = [];
  DeviceConnectionStatus _connectionStatus = DeviceConnectionStatus.checking;
  int? _lastDataUpdate;
  Timer? _simulationTimer;
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

  TelemetryService() {
    _initializeInitialData();
    _startDataStream();
    _startStatusChecker();
  }

  void _initializeInitialData() {
    final now = DateTime.now().millisecondsSinceEpoch;
    final random = Random();
    
    // Generate 15 initial history data points for graphs
    List<SensorReading> initialList = [];
    for (int i = 14; i >= 0; i--) {
      final timePoint = now - (i * 30000);
      initialList.add(
        SensorReading(
          id: 'log_$timePoint',
          ph: double.parse((6.1 + (random.nextDouble() * 0.4 - 0.2)).toStringAsFixed(2)),
          ec: double.parse((1.8 + (random.nextDouble() * 0.2 - 0.1)).toStringAsFixed(2)),
          oxygen: double.parse((8.0 + (random.nextDouble() * 0.4 - 0.2)).toStringAsFixed(1)),
          waterTemp: double.parse((22.4 + (random.nextDouble() * 0.6 - 0.3)).toStringAsFixed(1)),
          envTemp: double.parse((25.2 + (random.nextDouble() * 0.8 - 0.4)).toStringAsFixed(1)),
          envHumidity: double.parse((64.0 + (random.nextDouble() * 4 - 2)).toStringAsFixed(1)),
          time: timePoint,
        ),
      );
    }

    _logs = initialList;
    _lastDataUpdate = now;
    _connectionStatus = DeviceConnectionStatus.connected;
    notifyListeners();
  }

  void _startDataStream() {
    // Generate fresh reading every 6 seconds to simulate live IoT telemetry
    _simulationTimer = Timer.periodic(const Duration(seconds: 6), (timer) {
      final now = DateTime.now().millisecondsSinceEpoch;
      final random = Random();

      final previousReading = latestReading;
      final newPh = (previousReading?.ph ?? 6.2) + (random.nextDouble() * 0.1 - 0.05);
      final newEc = (previousReading?.ec ?? 1.8) + (random.nextDouble() * 0.06 - 0.03);
      final newOxygen = (previousReading?.oxygen ?? 8.1) + (random.nextDouble() * 0.1 - 0.05);
      final newWaterTemp = (previousReading?.waterTemp ?? 22.5) + (random.nextDouble() * 0.2 - 0.1);
      final newEnvTemp = (previousReading?.envTemp ?? 25.4) + (random.nextDouble() * 0.2 - 0.1);
      final newEnvHumidity = (previousReading?.envHumidity ?? 65.0) + (random.nextDouble() * 0.6 - 0.3);

      final newReading = SensorReading(
        id: 'log_$now',
        ph: double.parse(newPh.clamp(5.0, 7.5).toStringAsFixed(2)),
        ec: double.parse(newEc.clamp(1.0, 3.0).toStringAsFixed(2)),
        oxygen: double.parse(newOxygen.clamp(5.0, 10.0).toStringAsFixed(1)),
        waterTemp: double.parse(newWaterTemp.clamp(15.0, 32.0).toStringAsFixed(1)),
        envTemp: double.parse(newEnvTemp.clamp(18.0, 35.0).toStringAsFixed(1)),
        envHumidity: double.parse(newEnvHumidity.clamp(40.0, 90.0).toStringAsFixed(1)),
        time: now,
      );

      _logs.add(newReading);
      if (_logs.length > 30) {
        _logs.removeAt(0); // Keep last 30 readings
      }
      _lastDataUpdate = now;
      _connectionStatus = DeviceConnectionStatus.connected;
      notifyListeners();
    });
  }

  void _startStatusChecker() {
    _statusCheckTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_lastDataUpdate == null) {
        _connectionStatus = DeviceConnectionStatus.checking;
      } else {
        final timeDiff = DateTime.now().millisecondsSinceEpoch - _lastDataUpdate!;
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
    _simulationTimer?.cancel();
    _statusCheckTimer?.cancel();
    super.dispose();
  }
}
