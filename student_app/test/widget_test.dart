import 'package:flutter_test/flutter_test.dart';
import 'package:student_app/main.dart';

void main() {
  testWidgets('EduApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const EduApp());
    expect(find.text('EduPlatform'), findsOneWidget);
  });
}
