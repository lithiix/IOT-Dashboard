import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../services/telemetry_service.dart';
import '../../models/sensor_reading.dart';
import '../../theme/app_theme.dart';

class IotDashboardScreen extends StatefulWidget {
  const IotDashboardScreen({super.key});

  @override
  State<IotDashboardScreen> createState() => _IotDashboardScreenState();
}

class _IotDashboardScreenState extends State<IotDashboardScreen> {
  String _selectedMetricForChart = 'ph';
  String _selectedDevice = 'lionbit/device01';

  final List<Map<String, String>> _availableDevices = [
    {
      'id': 'lionbit/device01',
      'name': 'Gravity Tower Pro',
      'location': 'Greenhouse A (Active)',
    },
    {
      'id': 'lionbit/device02',
      'name': 'Hydro Tower Mini',
      'location': 'Kitchen Balcony',
    },
    {
      'id': 'lionbit/device03',
      'name': 'Commercial Aeroponic Array',
      'location': 'Commercial Farm (Bay 1)',
    },
  ];

  void _showDeviceSelectorModal(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final modalBg = isDark ? AppColors.surface : AppColors.lightSurface;
    final textColor = isDark ? Colors.white : AppColors.lightTextPrimary;
    final secondaryTextColor = isDark ? AppColors.textSecondary : AppColors.lightTextSecondary;

    showModalBottomSheet(
      context: context,
      backgroundColor: modalBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Select IoT Hardware Node',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close, color: secondaryTextColor),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ..._availableDevices.map((device) {
                final isSelected = device['id'] == _selectedDevice;
                final itemBg = isSelected
                    ? AppColors.primary.withValues(alpha: isDark ? 0.2 : 0.12)
                    : (isDark ? AppColors.surfaceLight : AppColors.lightSurfaceCard);
                final itemBorder = isSelected
                    ? AppColors.primary
                    : (isDark ? AppColors.surfaceBorder : AppColors.lightSurfaceBorder);

                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    color: itemBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: itemBorder),
                  ),
                  child: ListTile(
                    leading: Icon(
                      Icons.router_outlined,
                      color: isSelected ? AppColors.primary : secondaryTextColor,
                    ),
                    title: Text(
                      '${device['name']} (${device['id']})',
                      style: GoogleFonts.inter(
                        color: isSelected ? AppColors.primary : textColor,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                    subtitle: Text(
                      device['location']!,
                      style: GoogleFonts.inter(fontSize: 11, color: secondaryTextColor),
                    ),
                    trailing: isSelected
                        ? const Icon(Icons.check_circle, color: AppColors.primary, size: 20)
                        : null,
                    onTap: () {
                      setState(() => _selectedDevice = device['id']!);
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Switched active telemetry node to ${device['id']} (${device['name']})'),
                          backgroundColor: AppColors.primary,
                        ),
                      );
                    },
                  ),
                );
              }),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final telemetryService = Provider.of<TelemetryService>(context);
    final latest = telemetryService.latestReading;
    final status = telemetryService.connectionStatus;
    final logs = telemetryService.logs;

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.surface : AppColors.lightSurface;
    final cardBorder = isDark ? AppColors.surfaceBorder : AppColors.lightSurfaceBorder;
    final textColor = isDark ? Colors.white : AppColors.lightTextPrimary;
    final secondaryTextColor = isDark ? AppColors.textSecondary : AppColors.lightTextSecondary;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.menu, color: textColor),
          onPressed: () => _showDeviceSelectorModal(context),
          tooltip: 'Switch Hardware Node',
        ),
        title: Text(
          'IoT Aqua & Weather Dashboard',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: _buildStatusBadge(status),
          ),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await Future.delayed(const Duration(milliseconds: 600));
          },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Summary Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: cardBorder),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(
                        Icons.sensors_rounded,
                        color: AppColors.primary,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hydroponic Node $_selectedDevice',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            telemetryService.lastDataUpdate != null
                                ? 'Last sync: ${DateTime.fromMillisecondsSinceEpoch(telemetryService.lastDataUpdate!).toString().substring(11, 19)}'
                                : 'Connecting to sensor stream...',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: secondaryTextColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Sensor Metric Cards Grid
              Text(
                'Live Telemetry Metrics',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: 1.3,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
                children: [
                  _buildMetricCard(
                    context,
                    title: 'pH Level',
                    value: latest != null ? latest.ph.toStringAsFixed(2) : '--',
                    unit: 'pH',
                    isOptimal: latest?.isPhOptimal ?? true,
                    icon: Icons.science_outlined,
                    color: AppColors.primary,
                  ),
                  _buildMetricCard(
                    context,
                    title: 'Conductivity (EC)',
                    value: latest != null ? latest.ec.toStringAsFixed(2) : '--',
                    unit: 'mS/cm',
                    isOptimal: latest?.isEcOptimal ?? true,
                    icon: Icons.bolt_outlined,
                    color: AppColors.cyanAccent,
                  ),
                  _buildMetricCard(
                    context,
                    title: 'Dissolved O₂',
                    value: latest != null ? latest.oxygen.toStringAsFixed(1) : '--',
                    unit: 'mg/L',
                    isOptimal: latest?.isOxygenOptimal ?? true,
                    icon: Icons.water_drop_outlined,
                    color: Colors.blueAccent,
                  ),
                  _buildMetricCard(
                    context,
                    title: 'Water Temp',
                    value: latest != null ? latest.waterTemp.toStringAsFixed(1) : '--',
                    unit: '°C',
                    isOptimal: latest?.isWaterTempOptimal ?? true,
                    icon: Icons.thermostat_outlined,
                    color: Colors.orangeAccent,
                  ),
                  _buildMetricCard(
                    context,
                    title: 'Env Temp',
                    value: latest != null ? latest.envTemp.toStringAsFixed(1) : '--',
                    unit: '°C',
                    isOptimal: latest?.isEnvTempOptimal ?? true,
                    icon: Icons.wb_sunny_outlined,
                    color: Colors.amber,
                  ),
                  _buildMetricCard(
                    context,
                    title: 'Env Humidity',
                    value: latest != null ? latest.envHumidity.toStringAsFixed(1) : '--',
                    unit: '%',
                    isOptimal: latest?.isEnvHumidityOptimal ?? true,
                    icon: Icons.opacity_outlined,
                    color: Colors.teal,
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Interactive Historical Telemetry Graph (fl_chart)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: cardBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Telemetry Trend Chart',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        DropdownButton<String>(
                          value: _selectedMetricForChart,
                          dropdownColor: isDark ? AppColors.surfaceLight : AppColors.lightSurfaceCard,
                          style: GoogleFonts.inter(color: AppColors.primary, fontSize: 13, fontWeight: FontWeight.bold),
                          underline: const SizedBox(),
                          items: const [
                            DropdownMenuItem(value: 'ph', child: Text('pH Level')),
                            DropdownMenuItem(value: 'ec', child: Text('Conductivity (EC)')),
                            DropdownMenuItem(value: 'oxygen', child: Text('Dissolved Oxygen')),
                            DropdownMenuItem(value: 'waterTemp', child: Text('Water Temp (°C)')),
                            DropdownMenuItem(value: 'envTemp', child: Text('Env Temp (°C)')),
                            DropdownMenuItem(value: 'envHumidity', child: Text('Humidity (%)')),
                          ],
                          onChanged: (val) {
                            if (val != null) {
                              setState(() => _selectedMetricForChart = val);
                            }
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      height: 200,
                      child: logs.isEmpty
                          ? const Center(child: CircularProgressIndicator())
                          : _buildTelemetryChart(context, logs),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Actuator & Relays Control Toggles
              Text(
                'Device Controls & Actuators',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: cardBorder),
                ),
                child: Column(
                  children: [
                    _buildControlRow(
                      context,
                      title: 'Auto Nutrient Dosing Pump',
                      subtitle: 'Doses A&B liquid nutrients based on EC targets',
                      value: telemetryService.nutrientPumpActive,
                      onChanged: telemetryService.toggleNutrientPump,
                      icon: Icons.science,
                    ),
                    Divider(color: cardBorder, height: 24),
                    _buildControlRow(
                      context,
                      title: 'Water Recirculation Pump',
                      subtitle: 'Continuous aeration and roots hydration',
                      value: telemetryService.waterPumpActive,
                      onChanged: telemetryService.toggleWaterPump,
                      icon: Icons.waves,
                    ),
                    Divider(color: cardBorder, height: 24),
                    _buildControlRow(
                      context,
                      title: 'LED Grow Lights Array',
                      subtitle: '16h active schedule full spectrum',
                      value: telemetryService.growLightsActive,
                      onChanged: telemetryService.toggleGrowLights,
                      icon: Icons.light_mode,
                    ),
                    Divider(color: cardBorder, height: 24),
                    _buildControlRow(
                      context,
                      title: 'Exhaust & Micro-Climate Fan',
                      subtitle: 'Air circulation and humidity venting',
                      value: telemetryService.exhaustFanActive,
                      onChanged: telemetryService.toggleExhaustFan,
                      icon: Icons.air,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Sensor Logs Table
              Text(
                'Recent Sensor Stream Logs',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 12),
              Builder(
                builder: (context) {
                  final recentLogs = logs.reversed.take(6).toList();
                  return Container(
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: cardBorder),
                    ),
                    child: ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: recentLogs.length,
                      separatorBuilder: (context, index) => Divider(color: cardBorder, height: 1),
                      itemBuilder: (context, index) {
                        final log = recentLogs[index];
                        final timeStr = DateTime.fromMillisecondsSinceEpoch(log.time).toString().substring(11, 19);
                        return ListTile(
                          dense: true,
                          leading: Text(
                            timeStr,
                            style: GoogleFonts.inter(fontSize: 12, color: secondaryTextColor),
                          ),
                          title: Text(
                            'pH: ${log.ph} | EC: ${log.ec} mS/cm',
                            style: GoogleFonts.inter(fontSize: 13, color: textColor, fontWeight: FontWeight.w600),
                          ),
                          subtitle: Text(
                            'O₂: ${log.oxygen} mg/L | Water: ${log.waterTemp}°C | Air: ${log.envTemp}°C',
                            style: GoogleFonts.inter(fontSize: 11, color: secondaryTextColor),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    ),
  );
}

  Widget _buildStatusBadge(DeviceConnectionStatus status) {
    Color bg;
    Color text;
    String label;
    IconData icon;

    switch (status) {
      case DeviceConnectionStatus.connected:
        bg = AppColors.primary.withValues(alpha: 0.2);
        text = AppColors.primary;
        label = 'Online';
        icon = Icons.wifi;
        break;
      case DeviceConnectionStatus.error:
        bg = AppColors.danger.withValues(alpha: 0.2);
        text = AppColors.danger;
        label = 'Offline';
        icon = Icons.wifi_off;
        break;
      default:
        bg = Colors.amber.withValues(alpha: 0.2);
        text = Colors.amber;
        label = 'Checking';
        icon = Icons.sync;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: text),
          const SizedBox(width: 4),
          Text(
            label,
            style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: text),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(
    BuildContext context, {
    required String title,
    required String value,
    required String unit,
    required bool isOptimal,
    required IconData icon,
    required Color color,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.surface : AppColors.lightSurface;
    final cardBorder = isDark ? AppColors.surfaceBorder : AppColors.lightSurfaceBorder;
    final textColor = isDark ? Colors.white : AppColors.lightTextPrimary;
    final secondaryTextColor = isDark ? AppColors.textSecondary : AppColors.lightTextSecondary;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, size: 20, color: color),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isOptimal ? AppColors.primary.withValues(alpha: 0.2) : Colors.amber.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  isOptimal ? 'Optimal' : 'Caution',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    color: isOptimal ? AppColors.primary : Colors.amber,
                  ),
                ),
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    value,
                    style: GoogleFonts.inter(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    unit,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: secondaryTextColor,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 2),
              Text(
                title,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  color: secondaryTextColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildControlRow(
    BuildContext context, {
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required IconData icon,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : AppColors.lightTextPrimary;
    final secondaryTextColor = isDark ? AppColors.textSecondary : AppColors.lightTextSecondary;

    return Row(
      children: [
        Icon(icon, color: value ? AppColors.primary : secondaryTextColor, size: 22),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: textColor),
              ),
              Text(
                subtitle,
                style: GoogleFonts.inter(fontSize: 11, color: secondaryTextColor),
              ),
            ],
          ),
        ),
        Switch(
          value: value,
          activeTrackColor: AppColors.primary,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildTelemetryChart(BuildContext context, List<SensorReading> logs) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final gridBorder = isDark ? AppColors.surfaceBorder : AppColors.lightSurfaceBorder;

    final spots = <FlSpot>[];
    for (int i = 0; i < logs.length; i++) {
      double val;
      switch (_selectedMetricForChart) {
        case 'ec':
          val = logs[i].ec;
          break;
        case 'oxygen':
          val = logs[i].oxygen;
          break;
        case 'waterTemp':
          val = logs[i].waterTemp;
          break;
        case 'envTemp':
          val = logs[i].envTemp;
          break;
        case 'envHumidity':
          val = logs[i].envHumidity;
          break;
        default:
          val = logs[i].ph;
      }
      spots.add(FlSpot(i.toDouble(), val));
    }

    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          getDrawingHorizontalLine: (value) => FlLine(
            color: gridBorder,
            strokeWidth: 1,
          ),
        ),
        titlesData: const FlTitlesData(
          show: false,
        ),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: AppColors.primary,
            barWidth: 3,
            isStrokeCapRound: true,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
              show: true,
              color: AppColors.primary.withValues(alpha: 0.2),
            ),
          ),
        ],
      ),
    );
  }
}
