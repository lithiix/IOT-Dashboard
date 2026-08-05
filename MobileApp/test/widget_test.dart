import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:iot/main.dart';

void main() {
  testWidgets('GravityIotApp smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GravityIotApp());

    // Verify that customer portal elements exist
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
