class SensorReading {
  final String id;
  final double ph;
  final double ec;
  final double oxygen;
  final double waterTemp;
  final double envTemp;
  final double envHumidity;
  final int time;

  SensorReading({
    required this.id,
    required this.ph,
    required this.ec,
    required this.oxygen,
    required this.waterTemp,
    required this.envTemp,
    required this.envHumidity,
    required this.time,
  });

  static num _parseNum(dynamic value, num fallback) {
    if (value is num) return value;
    if (value is String) {
      return num.tryParse(value) ?? fallback;
    }
    return fallback;
  }

  factory SensorReading.fromJson(String id, Map<dynamic, dynamic> json) {
    return SensorReading(
      id: id,
      ph: _parseNum(json['ph'], 6.2).toDouble(),
      ec: _parseNum(json['ec'], 1.8).toDouble(),
      oxygen: _parseNum(json['oxygen'], 8.1).toDouble(),
      waterTemp: _parseNum(json['waterTemp'], 22.5).toDouble(),
      envTemp: _parseNum(json['envTemp'], 25.4).toDouble(),
      envHumidity: _parseNum(json['envHumidity'], 65.0).toDouble(),
      time: _parseNum(json['time'], DateTime.now().millisecondsSinceEpoch).toInt(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ph': ph,
      'ec': ec,
      'oxygen': oxygen,
      'waterTemp': waterTemp,
      'envTemp': envTemp,
      'envHumidity': envHumidity,
      'time': time,
    };
  }

  // Helper status checks matching website thresholds
  bool get isPhOptimal => ph >= 5.5 && ph <= 6.8;
  bool get isEcOptimal => ec >= 1.2 && ec <= 2.4;
  bool get isOxygenOptimal => oxygen >= 6.0;
  bool get isWaterTempOptimal => waterTemp >= 18.0 && waterTemp <= 25.0;
  bool get isEnvTempOptimal => envTemp >= 20.0 && envTemp <= 30.0;
  bool get isEnvHumidityOptimal => envHumidity >= 50.0 && envHumidity <= 75.0;
}
