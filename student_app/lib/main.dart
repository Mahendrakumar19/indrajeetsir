import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:file_picker/file_picker.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const EduApp());
}

// ============================================================================
// CENTRAL API SERVICE
// ============================================================================
class ApiService {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://backend.indrajeetsir.com',
  );

  static Future<bool> checkHealth() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/')).timeout(const Duration(seconds: 5));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  static Future<Map<String, dynamic>?> studentRegister({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String attemptYear,
    required String optionalSubject,
    String bio = 'Dedicated UPSC CSE Aspirant',
    String avatarKey = 'ias_officer',
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'phone': phone,
          'attempt': attemptYear,
          'optionalSubject': optionalSubject,
          'bio': bio,
          'avatarKey': avatarKey,
        }),
      ).timeout(const Duration(seconds: 10));

      if (res.statusCode == 200 || res.statusCode == 201) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic>) {
          return data;
        }
      } else {
        try {
          final data = jsonDecode(res.body);
          if (data is Map<String, dynamic>) return data;
        } catch (_) {}
      }
    } catch (_) {}
    return null;
  }

  static Future<List<Map<String, dynamic>>> fetchCourses() async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/courses'),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return data.map((item) => Map<String, dynamic>.from(item)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  static Future<List<Map<String, dynamic>>> fetchResources() async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/resources'),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return data.map((item) => Map<String, dynamic>.from(item)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  static Future<Map<String, dynamic>?> studentLogin(String email, String password) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/student-login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200 || res.statusCode == 201) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic> && data['success'] == true) {
          return data;
        }
      }
    } catch (_) {}
    return null;
  }

  static Future<List<Map<String, dynamic>>> fetchLiveClasses() async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/live-classes'),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return data.map((item) => Map<String, dynamic>.from(item)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  static Future<List<Map<String, dynamic>>> fetchNotifications() async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/notifications'),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return data.map((item) => Map<String, dynamic>.from(item)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  static Future<List<Map<String, dynamic>>> fetchMessages() async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/messages'),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List) {
          return data.map((item) {
            final m = Map<String, dynamic>.from(item);
            return {
              'id': (m['id'] ?? 'm-${DateTime.now().millisecondsSinceEpoch}').toString(),
              'sender': (m['studentName'] ?? m['sender'] ?? 'Indrajeet Sir').toString(),
              'text': (m['text'] ?? '').toString(),
              'time': (m['timestamp'] ?? 'Recently').toString(),
              'createdAtMs': m['createdAtMs'] is num ? (m['createdAtMs'] as num).toInt() : DateTime.now().millisecondsSinceEpoch,
              'fileName': m['fileName']?.toString(),
              'fileType': m['fileType']?.toString(),
              'fileUrl': m['fileUrl']?.toString(),
              'isEdited': m['isEdited'] == true,
            };
          }).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  static Future<Map<String, dynamic>?> sendMessage({
    required String studentName,
    required String text,
    String? fileName,
    String? fileType,
    String? fileUrl,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/messages'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'studentName': studentName,
          'text': text,
          'sender': 'student',
          'fileName': fileName,
          'fileType': fileType,
          'fileUrl': fileUrl,
        }),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200 || res.statusCode == 201) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic> && data['message'] != null) {
          return Map<String, dynamic>.from(data['message']);
        }
      }
    } catch (_) {}
    return null;
  }

  static Future<bool> editMessage({
    required String id,
    String? text,
    String? fileName,
    String? fileType,
    String? fileUrl,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/messages/$id/edit'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'text': text,
          'fileName': fileName,
          'fileType': fileType,
          'fileUrl': fileUrl,
        }),
      ).timeout(const Duration(seconds: 7));

      if (res.statusCode == 200 || res.statusCode == 201) {
        final data = jsonDecode(res.body);
        return data['success'] == true;
      }
    } catch (_) {}
    return false;
  }

  static Future<bool> syncProfile(StudentProfile profile) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/students'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': profile.name,
          'email': profile.email,
          'phone': profile.phone,
          'attempt': profile.attemptYear,
          'bio': profile.bio,
          'optionalSubject': profile.optionalSubject,
          'avatarKey': profile.avatarKey,
        }),
      ).timeout(const Duration(seconds: 7));

      return res.statusCode == 200 || res.statusCode == 201;
    } catch (_) {
      return false;
    }
  }
}

// ============================================================================
// STUDENT PROFILE MODEL
// ============================================================================
class StudentProfile {
  String name;
  String email;
  String phone;
  String attemptYear;
  String optionalSubject;
  String bio;
  String avatarKey;
  String enrolledCourse;

  StudentProfile({
    required this.name,
    required this.email,
    required this.phone,
    required this.attemptYear,
    required this.optionalSubject,
    required this.bio,
    this.avatarKey = 'ias_officer',
    this.enrolledCourse = 'Comprehensive UPSC CSE Mentorship 2026-27',
  });

  String get avatarDisplayEmoji {
    switch (avatarKey) {
      case 'ias_officer':
        return '👮‍♂️';
      case 'aspirant_male':
        return '👨‍🎓';
      case 'aspirant_female':
        return '👩‍🎓';
      case 'scholar':
        return '🧑‍🏫';
      case 'bookworm':
        return '📚';
      case 'top_ranker':
        return '🌟';
      default:
        return '👮‍♂️';
    }
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'phone': phone,
    'attemptYear': attemptYear,
    'optionalSubject': optionalSubject,
    'bio': bio,
    'avatarKey': avatarKey,
    'enrolledCourse': enrolledCourse,
  };

  factory StudentProfile.fromJson(Map<String, dynamic> json) => StudentProfile(
    name: json['name'] ?? 'Aspirant',
    email: json['email'] ?? '',
    phone: json['phone'] ?? '',
    attemptYear: (json['attemptYear'] ?? json['attempt'] ?? (DateTime.now().year + 1).toString()).toString(),
    optionalSubject: json['optionalSubject'] ?? 'General Studies',
    bio: json['bio'] ?? 'UPSC CSE Aspirant • Mentored by Indrajeet Sir',
    avatarKey: json['avatarKey'] ?? 'ias_officer',
    enrolledCourse: json['enrolledCourse'] ?? json['course'] ?? 'Comprehensive UPSC CSE Mentorship 2026-27',
  );
}

class SessionManager {
  static const String _sessionKey = 'indrajeet_student_session';

  static Future<StudentProfile?> getSavedProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString(_sessionKey);
      if (str != null && str.isNotEmpty) {
        final Map<String, dynamic> data = jsonDecode(str);
        return StudentProfile.fromJson(data);
      }
    } catch (_) {}
    return null;
  }

  static Future<void> saveProfile(StudentProfile profile) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_sessionKey, jsonEncode(profile.toJson()));
    } catch (_) {}
  }

  static Future<void> clearSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_sessionKey);
    } catch (_) {}
  }
}

// ============================================================================
// WEB REDIRECT & SESSION SYNCHRONIZATION SERVICE
// ============================================================================
class WebRedirectService {
  static const MethodChannel _channel = MethodChannel('com.nighwantech.indrajeetsir/launcher');
  static const String webBaseUrl = String.fromEnvironment(
    'WEB_BASE_URL',
    defaultValue: 'https://indrajeetsir.com',
  );

  static Future<bool> openUrl(String url) async {
    try {
      if (Platform.isAndroid) {
        final bool? ok = await _channel.invokeMethod<bool>('launchUrl', {'url': url});
        if (ok == true) return true;
      } else if (Platform.isWindows) {
        await Process.run('cmd', ['/c', 'start', '', url]);
        return true;
      } else if (Platform.isMacOS) {
        await Process.run('open', [url]);
        return true;
      } else if (Platform.isLinux) {
        await Process.run('xdg-open', [url]);
        return true;
      }
    } catch (e) {
      debugPrint('WebRedirectService.openUrl error: $e');
    }
    return false;
  }

  static String buildEnrollmentUrl({
    required StudentProfile? profile,
    String? courseId,
    String? courseTitle,
  }) {
    final queryParams = <String, String>{};
    if (profile != null) {
      if (profile.name.isNotEmpty && profile.name != 'Aspirant') {
        queryParams['name'] = profile.name;
      }
      if (profile.email.isNotEmpty) {
        queryParams['email'] = profile.email;
      }
      if (profile.phone.isNotEmpty) {
        queryParams['phone'] = profile.phone;
      }
      if (profile.attemptYear.isNotEmpty) {
        queryParams['attempt'] = profile.attemptYear;
      }
      if (profile.optionalSubject.isNotEmpty) {
        queryParams['optional'] = profile.optionalSubject;
      }
    }
    if (courseId != null && courseId.isNotEmpty) {
      queryParams['courseId'] = courseId;
    }
    if (courseTitle != null && courseTitle.isNotEmpty) {
      queryParams['courseTitle'] = courseTitle;
    }

    final uri = Uri.parse('$webBaseUrl/courses').replace(
      queryParameters: queryParams.isNotEmpty ? queryParams : null,
    );
    return uri.toString();
  }

  static Future<void> redirectToEnrollment(
    BuildContext context, {
    required StudentProfile? profile,
    String? courseId,
    String? courseTitle,
  }) async {
    final url = buildEnrollmentUrl(
      profile: profile,
      courseId: courseId,
      courseTitle: courseTitle,
    );
    final launched = await openUrl(url);
    if (!launched && context.mounted) {
      Clipboard.setData(ClipboardData(text: url));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Opening portal in your browser...'),
          backgroundColor: Color(0xFF10B981),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }
}

// ============================================================================
// APPLE iOS DESIGN SYSTEM & FROSTED GLASS COMPONENTS
// ============================================================================
class IosTheme {
  static const Color primaryBlue = Color(0xFF007AFF);
  static const Color systemIndigo = Color(0xFF5856D6);
  static const Color systemGreen = Color(0xFF34C759);
  static const Color systemOrange = Color(0xFFFF9500);
  static const Color systemRed = Color(0xFFFF3B30);

  // Backgrounds
  static const Color lightBg = Color(0xFFF2F2F7);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color darkBg = Color(0xFF000000);
  static const Color darkCard = Color(0xFF1C1C1E);
  static const Color darkCardSecondary = Color(0xFF2C2C2E);

  // Borders & Dividers
  static Color separator(bool isDark) =>
      isDark ? const Color(0x38545458) : const Color(0x333C3C43);
}

class IosGlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final Color? backgroundColor;
  final Border? border;
  final VoidCallback? onTap;

  const IosGlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius = 18.0,
    this.backgroundColor,
    this.border,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final defaultBg = isDark ? IosTheme.darkCard : IosTheme.lightCard;

    Widget card = Container(
      margin: margin,
      decoration: BoxDecoration(
        color: backgroundColor ?? defaultBg,
        borderRadius: BorderRadius.circular(borderRadius),
        border: border ??
            Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.04),
              width: 1.0,
            ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.35 : 0.04),
            blurRadius: 18,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: Padding(
          padding: padding ?? const EdgeInsets.all(16),
          child: child,
        ),
      ),
    );

    if (onTap != null) {
      return CupertinoButton(
        padding: EdgeInsets.zero,
        onPressed: onTap,
        child: card,
      );
    }
    return card;
  }
}

// ============================================================================
// ROOT APP
// ============================================================================
class EduApp extends StatefulWidget {
  const EduApp({super.key});

  @override
  State<EduApp> createState() => _EduAppState();
}

class _EduAppState extends State<EduApp> {
  ThemeMode _themeMode = ThemeMode.light;
  bool _isCheckingSession = true;
  StudentProfile? _activeSessionProfile;

  final StudentProfile _profile = StudentProfile(
    name: 'Aspirant',
    email: '',
    phone: '',
    attemptYear: (DateTime.now().year + 1).toString(),
    optionalSubject: 'General Studies',
    bio: 'UPSC CSE Aspirant • Mentored by Indrajeet Sir',
    avatarKey: 'ias_officer',
  );

  @override
  void initState() {
    super.initState();
    _restoreSavedSession();
  }

  Future<void> _restoreSavedSession() async {
    final saved = await SessionManager.getSavedProfile();
    if (mounted) {
      setState(() {
        if (saved != null && saved.email.trim().isNotEmpty) {
          _activeSessionProfile = saved;
          _profile.name = saved.name;
          _profile.email = saved.email;
          _profile.phone = saved.phone;
          _profile.attemptYear = saved.attemptYear;
          _profile.optionalSubject = saved.optionalSubject;
          _profile.bio = saved.bio;
          _profile.avatarKey = saved.avatarKey;
          _profile.enrolledCourse = saved.enrolledCourse;
        } else {
          _activeSessionProfile = null;
        }
        _isCheckingSession = false;
      });
    }
  }

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Indrajeet Sir',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: IosTheme.lightBg,
        primaryColor: IosTheme.primaryBlue,
        fontFamily: GoogleFonts.plusJakartaSans().fontFamily,
        appBarTheme: AppBarTheme(
          backgroundColor: IosTheme.lightBg,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: const IconThemeData(color: Colors.black),
          titleTextStyle: GoogleFonts.plusJakartaSans(
            color: Colors.black,
            fontSize: 17,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.3,
          ),
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: IosTheme.darkBg,
        primaryColor: IosTheme.primaryBlue,
        fontFamily: GoogleFonts.plusJakartaSans().fontFamily,
        appBarTheme: AppBarTheme(
          backgroundColor: IosTheme.darkBg,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: const IconThemeData(color: Colors.white),
          titleTextStyle: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontSize: 17,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.3,
          ),
        ),
      ),
      home: _isCheckingSession
          ? const SplashScreen()
          : _activeSessionProfile != null
              ? MainNavigation(
                  onThemeToggle: _toggleTheme,
                  profile: _activeSessionProfile!,
                  onProfileUpdate: (updated) {
                    setState(() {
                      _activeSessionProfile = updated;
                    });
                    SessionManager.saveProfile(updated);
                  },
                )
              : LoginScreen(
                  onThemeToggle: _toggleTheme,
                  profile: _profile,
                  onProfileUpdate: (updated) => setState(() {}),
                ),
    );
  }
}

// ============================================================================
// BRANDED SPLASH SCREEN: INDRAJEET SIR
// ============================================================================
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF000000) : const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),
              // Premium Logo Glow Box
              Container(
                width: 108,
                height: 108,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF2563EB), width: 3),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF2563EB).withValues(alpha: isDark ? 0.45 : 0.25),
                      blurRadius: 32,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: ClipOval(
                  child: Image.asset(
                    'assets/images/logo.png',
                    width: 108,
                    height: 108,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: const Color(0xFF2563EB),
                      child: const Center(
                        child: Icon(CupertinoIcons.person_fill, size: 52, color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Application Name
              Text(
                'Indrajeet Sir',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.6,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8),

              Text(
                'Mentorship & Live Classroom Portal',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ),

              const Spacer(),

              // Loading Indicator & Trust Footer
              const CupertinoActivityIndicator(radius: 14),
              const SizedBox(height: 16),
              Text(
                'Securing Connection...',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                  letterSpacing: 0.2,
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
// ============================================================================
// OFFICIAL WEBSITE ENROLLMENT & PURCHASE MODAL
// ============================================================================
void showWebsitePurchaseModal(
  BuildContext context, {
  StudentProfile? profile,
  String? courseTitle,
  int? price,
  String? courseId,
}) {
  final isDark = Theme.of(context).brightness == Brightness.dark;
  showCupertinoModalPopup(
    context: context,
    builder: (ctx) => Material(
      color: Colors.transparent,
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
        ),
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 38,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? Colors.white24 : Colors.black12,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 18),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: IosTheme.primaryBlue.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const FaIcon(FontAwesomeIcons.globe, size: 20, color: IosTheme.primaryBlue),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Official Website Enrollment',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            if (courseTitle != null) ...[
              Text(
                courseTitle,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              if (price != null)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    'Batch Fee: ₹${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF10B981)),
                  ),
                ),
              const SizedBox(height: 10),
            ],
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isDark ? Colors.white12 : Colors.black.withValues(alpha: 0.05),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '📌 Purchase & Admission Policy:',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'All batch admissions, fee transactions (UPI, Cards, NetBanking), and official GST invoices are processed exclusively on our official website portal.',
                    style: TextStyle(
                      fontSize: 12.5,
                      color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    '1. We will redirect you securely to indrajeetsir.com with your profile session pre-filled.\n2. Complete payment on the portal.\n3. Return to this app to attend live sessions!',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: IosTheme.primaryBlue,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: CupertinoButton.filled(
                borderRadius: BorderRadius.circular(14),
                onPressed: () {
                  Navigator.pop(ctx);
                  WebRedirectService.redirectToEnrollment(
                    context,
                    profile: profile,
                    courseId: courseId,
                    courseTitle: courseTitle,
                  );
                },
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(CupertinoIcons.arrow_up_right_square_fill, size: 18, color: Colors.white),
                    SizedBox(width: 8),
                    Text('Proceed to Website Enrollment', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 44,
              child: CupertinoButton(
                padding: EdgeInsets.zero,
                onPressed: () => Navigator.pop(ctx),
                child: Text(
                  'Dismiss',
                  style: TextStyle(
                    color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

// 1. APPLE iOS LOGIN SCREEN
// ============================================================================
class LoginScreen extends StatefulWidget {
  final VoidCallback onThemeToggle;
  final StudentProfile profile;
  final Function(StudentProfile) onProfileUpdate;

  const LoginScreen({
    super.key,
    required this.onThemeToggle,
    required this.profile,
    required this.onProfileUpdate,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  int _authMode = 0; // 0: Sign In, 1: Sign Up

  // Sign In Controllers (Clean empty fields - no pre-filled demo account)
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // Sign Up Controllers
  final _regNameController = TextEditingController();
  final _regEmailController = TextEditingController();
  final _regPasswordController = TextEditingController();
  final _regPhoneController = TextEditingController();
  final _regOptionalController = TextEditingController(text: 'Public Administration');
  String _regAttemptYear = (DateTime.now().year + 1).toString();

  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _regNameController.dispose();
    _regEmailController.dispose();
    _regPasswordController.dispose();
    _regPhoneController.dispose();
    _regOptionalController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty) {
      setState(() => _errorMessage = 'Please enter your registered email address.');
      return;
    }
    if (password.isEmpty) {
      setState(() => _errorMessage = 'Please enter your access passcode.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final data = await ApiService.studentLogin(email, password);

    if (mounted) {
      if (data != null && data['student'] != null) {
        final st = data['student'];
        widget.profile.name = st['name'] ?? widget.profile.name;
        widget.profile.email = st['email'] ?? widget.profile.email;
        widget.profile.phone = st['phone'] ?? widget.profile.phone;
        widget.profile.attemptYear = (st['attempt'] ?? widget.profile.attemptYear).toString();
        if (st['bio'] != null && (st['bio'] as String).isNotEmpty) {
          widget.profile.bio = st['bio'];
        }
        if (st['optionalSubject'] != null && (st['optionalSubject'] as String).isNotEmpty) {
          widget.profile.optionalSubject = st['optionalSubject'];
        }
        if (st['avatarKey'] != null && (st['avatarKey'] as String).isNotEmpty) {
          widget.profile.avatarKey = st['avatarKey'];
        }
        if (st['course'] != null && (st['course'] as String).isNotEmpty) {
          widget.profile.enrolledCourse = st['course'];
        } else if (st['enrolledCourse'] != null && (st['enrolledCourse'] as String).isNotEmpty) {
          widget.profile.enrolledCourse = st['enrolledCourse'];
        }
        widget.onProfileUpdate(widget.profile);
        await SessionManager.saveProfile(widget.profile);

        if (!mounted) return;
        setState(() => _isLoading = false);

        Navigator.pushReplacement(
          context,
          CupertinoPageRoute(
            builder: (context) => MainNavigation(
              onThemeToggle: widget.onThemeToggle,
              profile: widget.profile,
              onProfileUpdate: widget.onProfileUpdate,
            ),
          ),
        );
      } else {
        setState(() {
          _isLoading = false;
          _errorMessage = data?['message'] ?? 'Invalid credentials. Please verify your email and passcode.';
        });
      }
    }
  }

  Future<void> _register() async {
    final name = _regNameController.text.trim();
    final email = _regEmailController.text.trim();
    final password = _regPasswordController.text.trim();
    final phone = _regPhoneController.text.trim();
    final optional = _regOptionalController.text.trim();

    if (name.isEmpty) {
      setState(() => _errorMessage = 'Please enter your full name.');
      return;
    }
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _errorMessage = 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setState(() => _errorMessage = 'Password must be at least 6 characters.');
      return;
    }
    if (phone.isEmpty) {
      setState(() => _errorMessage = 'Please enter your WhatsApp or phone number.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await ApiService.studentRegister(
      name: name,
      email: email,
      password: password,
      phone: phone,
      attemptYear: _regAttemptYear,
      optionalSubject: optional.isNotEmpty ? optional : 'General Studies',
    );

    if (mounted) {
      if (res != null && res['success'] == true && res['student'] != null) {
        final st = res['student'];
        widget.profile.name = st['name'] ?? name;
        widget.profile.email = st['email'] ?? email;
        widget.profile.phone = st['phone'] ?? phone;
        widget.profile.attemptYear = (st['attempt'] ?? _regAttemptYear).toString();
        widget.profile.optionalSubject = st['optionalSubject'] ?? (optional.isNotEmpty ? optional : 'General Studies');
        widget.profile.bio = st['bio'] ?? 'UPSC CSE $_regAttemptYear Aspirant';
        widget.profile.avatarKey = st['avatarKey'] ?? 'ias_officer';
        widget.profile.enrolledCourse = 'Self-Registered Aspirant (Awaiting Batch Enrollment)';

        widget.onProfileUpdate(widget.profile);
        await SessionManager.saveProfile(widget.profile);

        if (!mounted) return;
        setState(() => _isLoading = false);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Account created successfully! Welcome to Indrajeet Sir\'s Mentorship.'),
            backgroundColor: Color(0xFF10B981),
            duration: Duration(seconds: 3),
          ),
        );

        Navigator.pushReplacement(
          context,
          CupertinoPageRoute(
            builder: (context) => MainNavigation(
              onThemeToggle: widget.onThemeToggle,
              profile: widget.profile,
              onProfileUpdate: widget.onProfileUpdate,
            ),
          ),
        );
      } else {
        setState(() {
          _isLoading = false;
          _errorMessage = res?['message'] ?? 'Failed to register. Please check details or sign in.';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Academy Official Logo
                Container(
                  width: 86,
                  height: 86,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFF2563EB), width: 2.5),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF2563EB).withValues(alpha: 0.35),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      'assets/images/logo.png',
                      width: 86,
                      height: 86,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: const Color(0xFF2563EB),
                        child: const Center(
                          child: Icon(CupertinoIcons.person_fill, size: 40, color: Colors.white),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                const Text(
                  'Indrajeet Sir',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.6,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Mentorship & Live Classroom Portal',
                  style: TextStyle(
                    fontSize: 13.5,
                    color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 24),

                // iOS Sliding Segmented Control for Sign In vs Sign Up
                SizedBox(
                  width: double.infinity,
                  child: CupertinoSlidingSegmentedControl<int>(
                    groupValue: _authMode,
                    backgroundColor: isDark ? const Color(0xFF1C1C1E) : const Color(0xFFE5E5EA),
                    thumbColor: isDark ? const Color(0xFF2C2C2E) : Colors.white,
                    children: const {
                      0: Padding(
                        padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                        child: Text('Sign In', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
                      ),
                      1: Padding(
                        padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                        child: Text('New Aspirant? Sign Up', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
                      ),
                    },
                    onValueChanged: (val) {
                      if (val != null) {
                        setState(() {
                          _authMode = val;
                          _errorMessage = null;
                        });
                      }
                    },
                  ),
                ),
                const SizedBox(height: 18),

                // Error Message Banner (if any)
                if (_errorMessage != null) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF4444).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFEF4444).withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(CupertinoIcons.exclamationmark_triangle_fill, size: 16, color: Color(0xFFEF4444)),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(fontSize: 12.5, color: Color(0xFFDC2626), fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // ─── AUTH MODE 0: SIGN IN ─────────────────────────────────────
                if (_authMode == 0) ...[
                  IosGlassCard(
                    padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
                    borderRadius: 18,
                    child: Column(
                      children: [
                        CupertinoTextField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          placeholder: 'Student Email Address',
                          prefix: const Padding(
                            padding: EdgeInsets.only(right: 10, left: 2),
                            child: FaIcon(FontAwesomeIcons.envelope, size: 16, color: CupertinoColors.systemGrey),
                          ),
                          decoration: const BoxDecoration(),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black),
                        ),
                        Divider(height: 1, color: IosTheme.separator(isDark)),
                        CupertinoTextField(
                          controller: _passwordController,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          placeholder: 'Access Passcode',
                          obscureText: true,
                          prefix: const Padding(
                            padding: EdgeInsets.only(right: 10, left: 2),
                            child: FaIcon(FontAwesomeIcons.lock, size: 16, color: CupertinoColors.systemGrey),
                          ),
                          decoration: const BoxDecoration(),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: CupertinoButton.filled(
                      borderRadius: BorderRadius.circular(16),
                      onPressed: _isLoading ? null : _login,
                      child: _isLoading
                          ? const CupertinoActivityIndicator(color: Colors.white)
                          : const Text(
                              'Sign In to Mentorship',
                              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15.5),
                            ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: () => setState(() {
                      _authMode = 1;
                      _errorMessage = null;
                    }),
                    child: const Text(
                      'New to Mentorship? Create Aspirant Account →',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: IosTheme.primaryBlue),
                    ),
                  ),
                ]

                // ─── AUTH MODE 1: SIGN UP ─────────────────────────────────────
                else ...[
                  IosGlassCard(
                    padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
                    borderRadius: 18,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CupertinoTextField(
                          controller: _regNameController,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          placeholder: 'Full Name (Aspirant Name)',
                          prefix: const Padding(
                            padding: EdgeInsets.only(right: 10, left: 2),
                            child: FaIcon(FontAwesomeIcons.user, size: 16, color: CupertinoColors.systemGrey),
                          ),
                          decoration: const BoxDecoration(),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black),
                        ),
                        Divider(height: 1, color: IosTheme.separator(isDark)),
                        CupertinoTextField(
                          controller: _regEmailController,
                          keyboardType: TextInputType.emailAddress,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          placeholder: 'Email Address',
                          prefix: const Padding(
                            padding: EdgeInsets.only(right: 10, left: 2),
                            child: FaIcon(FontAwesomeIcons.envelope, size: 16, color: CupertinoColors.systemGrey),
                          ),
                          decoration: const BoxDecoration(),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black),
                        ),
                        Divider(height: 1, color: IosTheme.separator(isDark)),
                        CupertinoTextField(
                          controller: _regPasswordController,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          placeholder: 'Create Password (min 6 chars)',
                          obscureText: true,
                          prefix: const Padding(
                            padding: EdgeInsets.only(right: 10, left: 2),
                            child: FaIcon(FontAwesomeIcons.lock, size: 16, color: CupertinoColors.systemGrey),
                          ),
                          decoration: const BoxDecoration(),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black),
                        ),
                        Divider(height: 1, color: IosTheme.separator(isDark)),
                        CupertinoTextField(
                          controller: _regPhoneController,
                          keyboardType: TextInputType.phone,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          placeholder: 'WhatsApp / Phone (+91)',
                          prefix: const Padding(
                            padding: EdgeInsets.only(right: 10, left: 2),
                            child: FaIcon(FontAwesomeIcons.phone, size: 16, color: CupertinoColors.systemGrey),
                          ),
                          decoration: const BoxDecoration(),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black),
                        ),
                        Divider(height: 1, color: IosTheme.separator(isDark)),
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          child: Row(
                            children: [
                              const Text(
                                'Target Attempt: ',
                                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: CupertinoColors.systemGrey),
                              ),
                              const Spacer(),
                              for (final yr in [
                                (DateTime.now().year + 1).toString(),
                                (DateTime.now().year + 2).toString(),
                                (DateTime.now().year + 3).toString(),
                              ])
                                Padding(
                                  padding: const EdgeInsets.only(left: 6),
                                  child: GestureDetector(
                                    onTap: () => setState(() => _regAttemptYear = yr),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                      decoration: BoxDecoration(
                                        color: _regAttemptYear == yr
                                            ? IosTheme.primaryBlue
                                            : (isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA)),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        yr,
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: _regAttemptYear == yr ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                        Divider(height: 1, color: IosTheme.separator(isDark)),
                        CupertinoTextField(
                          controller: _regOptionalController,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          placeholder: 'Optional Subject (e.g. Pub Ad, PSIR)',
                          prefix: const Padding(
                            padding: EdgeInsets.only(right: 10, left: 2),
                            child: FaIcon(FontAwesomeIcons.bookOpen, size: 16, color: CupertinoColors.systemGrey),
                          ),
                          decoration: const BoxDecoration(),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: CupertinoButton.filled(
                      borderRadius: BorderRadius.circular(16),
                      onPressed: _isLoading ? null : _register,
                      child: _isLoading
                          ? const CupertinoActivityIndicator(color: Colors.white)
                          : const Text(
                              'Create Aspirant Account',
                              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15.5),
                            ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: () => setState(() {
                      _authMode = 0;
                      _errorMessage = null;
                    }),
                    child: const Text(
                      'Already registered? Sign In →',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: IosTheme.primaryBlue),
                    ),
                  ),
                ],

                const SizedBox(height: 18),

                // Website Purchase Policy Notice
                GestureDetector(
                  onTap: () => showWebsitePurchaseModal(
                    context,
                    profile: StudentProfile(
                      name: _regNameController.text.trim().isEmpty ? 'Aspirant' : _regNameController.text.trim(),
                      email: _regEmailController.text.trim(),
                      phone: _regPhoneController.text.trim(),
                      attemptYear: _regAttemptYear,
                      optionalSubject: _regOptionalController.text.trim(),
                      bio: 'UPSC CSE Aspirant • Mentored by Indrajeet Sir',
                    ),
                  ),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: IosTheme.primaryBlue.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: IosTheme.primaryBlue.withValues(alpha: 0.2)),
                    ),
                    child: Row(
                      children: [
                        const Icon(CupertinoIcons.info_circle_fill, size: 16, color: IosTheme.primaryBlue),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'All course admissions & fee purchases are completed on website (indrajeetsir.com)',
                            style: TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w600,
                              color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF1D4ED8),
                            ),
                          ),
                        ),
                        const Icon(CupertinoIcons.chevron_right, size: 12, color: IosTheme.primaryBlue),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                Text(
                  'Help Desk: +91 98734 86158 • indrajeet.visionias@gmail.com',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// 2. MAIN APP NAVIGATION WITH iOS DYNAMIC ISLAND NOTIFICATION & GLASS DOCK
// ============================================================================
class MainNavigation extends StatefulWidget {
  final VoidCallback onThemeToggle;
  final StudentProfile profile;
  final Function(StudentProfile) onProfileUpdate;

  const MainNavigation({
    super.key,
    required this.onThemeToggle,
    required this.profile,
    required this.onProfileUpdate,
  });

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

  // 10-Minute Reminder System
  Timer? _reminderTimer;
  bool _reminderEnabled = true;
  bool _showAlertIsland = false;
  bool _isIslandExpanded = false;
  DateTime? _snoozedUntil;
  Map<String, dynamic>? _upcomingAlertClass;
  int _minutesRemaining = 10;

  @override
  void initState() {
    super.initState();
    _startReminderService();
  }

  @override
  void dispose() {
    _reminderTimer?.cancel();
    super.dispose();
  }

  void _startReminderService() {
    _checkUpcomingClasses();
    _reminderTimer = Timer.periodic(const Duration(seconds: 25), (_) {
      if (_reminderEnabled) {
        _checkUpcomingClasses();
      }
    });
  }

  Future<void> _checkUpcomingClasses() async {
    if (_snoozedUntil != null && DateTime.now().isBefore(_snoozedUntil!)) {
      return;
    }

    // 1. Check real-time push broadcast notifications from teacher/admin
    final notifs = await ApiService.fetchNotifications();
    if (notifs.isNotEmpty) {
      final latest = notifs.first;
      final target = (latest['target'] ?? latest['audience'] ?? 'All Students').toString();
      final isMine = target == 'All Students' ||
          target == 'All App Users' ||
          target.toLowerCase().contains(widget.profile.name.toLowerCase());

      if (isMine && latest['type'] == 'SESSION_REMINDER') {
        if (mounted && !_showAlertIsland) {
          setState(() {
            _upcomingAlertClass = {
              'title': latest['title']?.toString().replaceAll('🔴 Class Reminder: ', '') ?? 'Live Mentorship Session',
              'meetLink': latest['meetLink'] ?? 'https://live.indrajeetsir.com/session/upsc-2026',
              'date': latest['date'] ?? 'Today',
              'time': latest['time'] ?? 'Now',
            };
            _minutesRemaining = 10;
            _showAlertIsland = true;
          });
          return;
        }
      }
    }

    // 2. Check scheduled live classes for automatic countdown reminders
    final classes = await ApiService.fetchLiveClasses();
    if (classes.isEmpty) return;

    final now = DateTime.now();

    for (final cls in classes) {
      final assigned = (cls['assignedStudent'] ?? 'All Students').toString();
      final isAllotted = assigned == 'All Students' ||
          assigned.toLowerCase().contains(widget.profile.name.toLowerCase());

      if (!isAllotted) continue;

      DateTime? classTime;
      try {
        final dateStr = cls['date']?.toString() ?? '';
        final timeStr = cls['time']?.toString() ?? '19:00';
        final parts = timeStr.split(':');
        final hour = parts.isNotEmpty ? int.tryParse(parts[0]) ?? 19 : 19;
        final minute = parts.length > 1 ? int.tryParse(parts[1]) ?? 0 : 0;
        final parsedDate = DateTime.tryParse(dateStr) ?? now;
        classTime = DateTime(parsedDate.year, parsedDate.month, parsedDate.day, hour, minute);
      } catch (_) {
        classTime = now.add(const Duration(minutes: 9));
      }

      final diffInMinutes = classTime.difference(now).inMinutes;

      // Class is starting within 60 minutes or live right now
      if (diffInMinutes >= -30 && diffInMinutes <= 60) {
        if (mounted) {
          setState(() {
            _upcomingAlertClass = cls;
            _minutesRemaining = diffInMinutes <= 0 ? 0 : diffInMinutes;
            _showAlertIsland = true;
          });
        }
        break;
      }
    }
  }

  // ── iOS DYNAMIC ISLAND HEADS-UP NOTIFICATION PILL ──
  Widget _buildDynamicIslandPill(BuildContext context) {
    final cls = _upcomingAlertClass ?? {
      'title': 'GS-3 Strategy & Evaluation Session',
      'meetLink': 'https://meet.google.com/abc-defg-hij',
    };
    final meetUrl = cls['meetLink'] ?? cls['meetingUrl'] ?? 'https://meet.google.com/abc-defg-hij';

    return GestureDetector(
      onTap: () {
        setState(() => _isIslandExpanded = !_isIslandExpanded);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 320),
        curve: Curves.easeOutBack,
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: EdgeInsets.symmetric(
          horizontal: _isIslandExpanded ? 18 : 14,
          vertical: _isIslandExpanded ? 16 : 10,
        ),
        decoration: BoxDecoration(
          color: Colors.black.withValues(alpha: 0.92),
          borderRadius: BorderRadius.circular(_isIslandExpanded ? 24 : 32),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.18),
            width: 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.4),
              blurRadius: 28,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(_isIslandExpanded ? 24 : 32),
          child: BackdropFilter(
            filter: ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: _isIslandExpanded
                ? Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: IosTheme.systemOrange,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'LIVE IN $_minutesRemaining MINS',
                                style: const TextStyle(
                                  color: IosTheme.systemOrange,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                          CupertinoButton(
                            padding: EdgeInsets.zero,
                            minimumSize: Size.zero,
                            child: const Icon(CupertinoIcons.xmark, size: 16, color: Colors.white70),
                            onPressed: () {
                              setState(() {
                                _showAlertIsland = false;
                                _isIslandExpanded = false;
                                _snoozedUntil = DateTime.now().add(const Duration(minutes: 5));
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        cls['title'] ?? 'Direct Mentorship Session',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Indrajeet Sir is joining your classroom',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.65),
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: CupertinoButton(
                              color: IosTheme.primaryBlue,
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              borderRadius: BorderRadius.circular(12),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(CupertinoIcons.videocam_fill, size: 16, color: Colors.white),
                                  SizedBox(width: 6),
                                  Text(
                                    'Join Classroom',
                                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white),
                                  ),
                                ],
                              ),
                              onPressed: () {
                                setState(() {
                                  _showAlertIsland = false;
                                  _isIslandExpanded = false;
                                });
                                _showJoinSheet(context, cls['title'] ?? 'Live Classroom', meetUrl);
                              },
                            ),
                          ),
                          const SizedBox(width: 10),
                          CupertinoButton(
                            color: Colors.white.withValues(alpha: 0.12),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            borderRadius: BorderRadius.circular(12),
                            child: const Text(
                              'Snooze',
                              style: TextStyle(fontSize: 13, color: Colors.white70),
                            ),
                            onPressed: () {
                              setState(() {
                                _showAlertIsland = false;
                                _isIslandExpanded = false;
                                _snoozedUntil = DateTime.now().add(const Duration(minutes: 5));
                              });
                            },
                          ),
                        ],
                      ),
                    ],
                  )
                : Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: IosTheme.systemOrange.withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(CupertinoIcons.alarm_fill, size: 14, color: IosTheme.systemOrange),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          '${cls['title'] ?? 'Classroom'} • ${_minutesRemaining}m left',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          color: IosTheme.primaryBlue,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Join',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }

  void _showJoinSheet(BuildContext context, String title, String url) {
    showCupertinoModalPopup(
      context: context,
      builder: (ctx) => CupertinoActionSheet(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
        message: const Text('Connecting to Indrajeet Sir\'s secure classroom session.'),
        actions: [
          CupertinoActionSheetAction(
            isDefaultAction: true,
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Launching live classroom meeting session...'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
            child: const Text('Launch Video Session'),
          ),
        ],
        cancelButton: CupertinoActionSheetAction(
          onPressed: () => Navigator.pop(ctx),
          child: const Text('Cancel'),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(
        onThemeToggle: widget.onThemeToggle,
        profile: widget.profile,
        upcomingClass: _upcomingAlertClass,
        minutesRemaining: _minutesRemaining,
        onNavigateTab: (index) => setState(() => _selectedIndex = index),
      ),
      LiveSessionsScreen(profile: widget.profile),
      ChatScreen(profile: widget.profile),
      ProfileScreen(
        onThemeToggle: widget.onThemeToggle,
        profile: widget.profile,
        reminderEnabled: _reminderEnabled,
        onReminderToggle: (val) => setState(() => _reminderEnabled = val),
        onProfileUpdate: (updated) {
          widget.onProfileUpdate(updated);
          setState(() {});
        },
      ),
    ];

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      extendBody: true,
      body: Stack(
        children: [
          IndexedStack(
            index: _selectedIndex,
            children: screens,
          ),

          // ── FLOATING iOS DYNAMIC ISLAND HEADS-UP REMINDER ──
          if (_showAlertIsland)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: SafeArea(
                child: _buildDynamicIslandPill(context),
              ),
            ),

          // ── ULTRA REFINED iOS FROSTED FLOATING TAB DOCK ──
          Positioned(
            left: 20,
            right: 20,
            bottom: MediaQuery.of(context).padding.bottom + 12,
            child: Container(
              height: 64,
              decoration: BoxDecoration(
                color: isDark
                    ? const Color(0xFF1C1C1E).withValues(alpha: 0.85)
                    : Colors.white.withValues(alpha: 0.88),
                borderRadius: BorderRadius.circular(32),
                border: Border.all(
                  color: isDark ? Colors.white.withValues(alpha: 0.12) : Colors.black.withValues(alpha: 0.06),
                  width: 1.0,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: isDark ? 0.35 : 0.08),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(32),
                child: BackdropFilter(
                  filter: ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                  child: Row(
                    children: [
                      _buildDockItem(0, FontAwesomeIcons.house, 'Home'),
                      _buildDockItem(1, FontAwesomeIcons.graduationCap, 'Courses'),
                      _buildDockItem(2, FontAwesomeIcons.solidComments, 'Mentorship'),
                      _buildDockItem(3, FontAwesomeIcons.gear, 'Settings'),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDockItem(int index, FaIconData icon, String label) {
    final isSelected = _selectedIndex == index;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final activeColor = IosTheme.primaryBlue;
    final inactiveColor = isDark ? CupertinoColors.systemGrey : CupertinoColors.systemGrey2;

    return Expanded(
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          if (_selectedIndex != index) {
            setState(() => _selectedIndex = index);
          }
        },
        child: Center(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: isSelected
                  ? (isDark ? activeColor.withValues(alpha: 0.18) : activeColor.withValues(alpha: 0.10))
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                FaIcon(
                  icon,
                  size: 19,
                  color: isSelected ? activeColor : inactiveColor,
                ),
                const SizedBox(height: 3),
                Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                    color: isSelected ? activeColor : inactiveColor,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// IN-APP NATIVE PDF VIEWER SCREEN
// ============================================================================
class PdfViewerScreen extends StatefulWidget {
  final String title;
  final String url;

  const PdfViewerScreen({
    super.key,
    required this.title,
    required this.url,
  });

  @override
  State<PdfViewerScreen> createState() => _PdfViewerScreenState();
}

class _PdfViewerScreenState extends State<PdfViewerScreen> {
  static const MethodChannel _channel = MethodChannel('com.nighwantech.indrajeetsir/launcher');

  bool _isLoading = true;
  String? _errorMessage;
  String? _localFilePath;
  int _pageCount = 0;
  final Map<int, Uint8List> _pageCache = {};
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _downloadAndOpenPdf();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _downloadAndOpenPdf() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _pageCache.clear();
    });

    try {
      final uri = Uri.parse(widget.url);
      final res = await http.get(uri).timeout(const Duration(seconds: 30));

      if (res.statusCode != 200 || res.bodyBytes.isEmpty) {
        throw Exception('Server returned status ${res.statusCode}');
      }

      final tempDir = Directory.systemTemp;
      final fileName = 'doc_${widget.url.hashCode.abs()}.pdf';
      final file = File('${tempDir.path}/$fileName');
      await file.writeAsBytes(res.bodyBytes, flush: true);
      _localFilePath = file.path;

      if (Platform.isAndroid) {
        final count = await _channel.invokeMethod<int>('getPdfPageCount', {'path': file.path});
        if (count != null && count > 0) {
          if (mounted) {
            setState(() {
              _pageCount = count;
              _isLoading = false;
            });
          }
          return;
        }
      }

      if (mounted) {
        setState(() {
          _pageCount = 1;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Unable to load PDF document: $e';
        });
      }
    }
  }

  Future<Uint8List?> _getPageBytes(int index) async {
    if (_pageCache.containsKey(index)) {
      return _pageCache[index];
    }
    if (_localFilePath == null) return null;

    try {
      if (Platform.isAndroid) {
        final bytes = await _channel.invokeMethod<Uint8List>('renderPdfPage', {
          'path': _localFilePath,
          'pageIndex': index,
          'scale': 2.0,
        });
        if (bytes != null) {
          _pageCache[index] = bytes;
          return bytes;
        }
      }
    } catch (e) {
      debugPrint('Error rendering page $index: $e');
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return CupertinoPageScaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : const Color(0xFFE2E8F0),
      navigationBar: CupertinoNavigationBar(
        backgroundColor: (isDark ? const Color(0xFF1C1C1E) : Colors.white).withValues(alpha: 0.95),
        middle: Text(
          widget.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 14.5,
            fontWeight: FontWeight.w700,
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
        trailing: _pageCount > 0
            ? Text(
                '$_pageCount Pages',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: IosTheme.primaryBlue,
                ),
              )
            : null,
      ),
      child: SafeArea(
        child: _buildContent(isDark),
      ),
    );
  }

  Widget _buildContent(bool isDark) {
    if (_isLoading) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CupertinoActivityIndicator(radius: 14),
            const SizedBox(height: 14),
            Text(
              'Opening PDF inside app...',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isDark ? Colors.white70 : CupertinoColors.systemGrey,
              ),
            ),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(CupertinoIcons.exclamationmark_triangle_fill, color: Color(0xFFEF4444), size: 40),
              const SizedBox(height: 12),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 16),
              CupertinoButton.filled(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                borderRadius: BorderRadius.circular(10),
                onPressed: _downloadAndOpenPdf,
                child: const Text('Try Again', style: TextStyle(fontWeight: FontWeight.w700)),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      controller: _scrollController,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(vertical: 12),
      itemCount: _pageCount,
      itemBuilder: (context, index) {
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(6),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.35 : 0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: FutureBuilder<Uint8List?>(
              future: _getPageBytes(index),
              builder: (ctx, snapshot) {
                if (snapshot.connectionState == ConnectionState.done && snapshot.hasData && snapshot.data != null) {
                  return InteractiveViewer(
                    minScale: 1.0,
                    maxScale: 3.5,
                    child: Image.memory(
                      snapshot.data!,
                      fit: BoxFit.contain,
                      filterQuality: FilterQuality.high,
                    ),
                  );
                }
                if (snapshot.hasError) {
                  return Container(
                    height: 380,
                    color: Colors.white,
                    alignment: Alignment.center,
                    child: const Text(
                      'Page could not be rendered',
                      style: TextStyle(color: CupertinoColors.systemGrey, fontSize: 12),
                    ),
                  );
                }
                return Container(
                  height: 480,
                  color: Colors.white,
                  child: const Center(
                    child: CupertinoActivityIndicator(),
                  ),
                );
              },
            ),
          ),
        );
      },
    );
  }
}

// ============================================================================
// 3. HOME SCREEN (OVERVIEW) — CLEAN iOS HIG DESIGN
// ============================================================================
class HomeScreen extends StatefulWidget {
  final VoidCallback onThemeToggle;
  final StudentProfile profile;
  final Map<String, dynamic>? upcomingClass;
  final int minutesRemaining;
  final Function(int) onNavigateTab;

  const HomeScreen({
    super.key,
    required this.onThemeToggle,
    required this.profile,
    this.upcomingClass,
    this.minutesRemaining = 10,
    required this.onNavigateTab,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Map<String, dynamic>> _courses = [];
  List<Map<String, dynamic>> _resources = [];
  bool _isLoading = true;

  final List<Map<String, dynamic>> _defaultCoursesFallback = [
    {
      'id': 'c-1',
      'title': '1 Year Full Mentorship for UPSC 2027 (After Foundation Course)',
      'description': 'Complete 3-Stage Prelims, Mains, and Interview guidance with 1-on-1 personal mentorship by Indrajeet Sir.',
      'price': 24000,
      'originalPrice': 60000,
      'discount': '60% OFF',
      'validity': '365+1 Day (1 Year)',
      'tag': 'Comprehensive Flagship',
      'thumbnail': 'https://indrajeetsir.com/courses/course-1.svg',
      'features': [
        'Prelims: High-yield Notes, PYQ+, 20 Mock Tests, Total 5,000+ Practice Questions',
        'Mains: Short Notes, Deep PYQ Trend Analysis, Toppers Copy, 16 Evaluated Tests',
        'Weekly Strategy Sessions & 1-on-1 Personal Mentorship by Indrajeet Sir',
        'Interview: Personality Development, Book Reading Habits & Newspaper Analysis',
      ],
    },
    {
      'id': 'c-2',
      'title': 'Mains Mentorship 2026/2027 (Comprehensive GS & Answer Writing)',
      'description': 'Master Mains answer writing precision, daily evaluations, and structured feedback from Indrajeet Sir.',
      'price': 18000,
      'originalPrice': 45000,
      'discount': '60% OFF',
      'validity': '4–5 Months',
      'tag': 'Mains Intensive',
      'thumbnail': 'https://indrajeetsir.com/courses/course-2.svg',
      'features': [
        '600+ Topic Short Note Making Framework for GS Paper 1, 2, 3, and 4',
        'Deep Trend Analysis of Last 12 Years UPSC Mains Questions',
        'Toppers Copy Structural & Presentation Reverse-Engineering',
        '16 Evaluated Tests (Mini, Sectional & Full Length) with Line-by-Line Review',
      ],
    },
    {
      'id': 'c-3',
      'title': 'Prelims Mentorship 2026 (Targeted Prelims Mastery & PYQ Reverse Engineering)',
      'description': 'Eliminate option traps, master theme forecasting, and secure 110+ cutoff safety in UPSC Prelims.',
      'price': 15000,
      'originalPrice': 37500,
      'discount': '60% OFF',
      'validity': '5–6 Months',
      'tag': 'Prelims Mastery',
      'thumbnail': 'https://indrajeetsir.com/courses/course-3.svg',
      'features': [
        'High-Yield Prelims Short Notes & Option Elimination Tactics',
        'PYQ+ Trend Forecasting (Mapping Past 10-Year Themes to Future Questions)',
        '20 Full-Length Mock Tests with In-Depth Performance Analytics',
        '5,000+ Topic-Wise High Probability Practice Questions',
      ],
    },
    {
      'id': 'c-4',
      'title': 'Parallel Mentorship with Foundation Course (18 Months Extended Support)',
      'description': 'Designed for aspirants currently enrolled in coaching classes who need parallel personal guidance and accountability.',
      'price': 28000,
      'originalPrice': 70000,
      'discount': '60% OFF',
      'validity': '18 Months',
      'tag': 'Extended Parallel Support',
      'thumbnail': 'https://indrajeetsir.com/courses/course-4.svg',
      'features': [
        'Synchronized Study Schedules Parallel to Your Coaching Classroom',
        'Weekly Syllabus Coverage & Consistency Audits with Sir',
        'Early Answer Writing Fundamentals & Keyword Placement Training',
        'Full 18 Months Direct Mentor Access and Doubt Resolution',
      ],
    },
    {
      'id': 'c-5',
      'title': 'Mains Short Notes Making Mentorship (GS 1, 2, 3 & 4 Ready Reckoners)',
      'description': 'Consolidate 10,000+ pages of bulky coaching material into concise 600+ micro-notes for lightning revision.',
      'price': 9000,
      'originalPrice': 22500,
      'discount': '60% OFF',
      'validity': '2 Months',
      'tag': 'Micro Notes Mastery',
      'thumbnail': 'https://indrajeetsir.com/courses/course-5.svg',
      'features': [
        'Micro-Syllabus Breakdown of Every Single UPSC Mains Keyword',
        'Intro-Body-Conclusion Ready Templates & Value Addition Enriched',
        'Diagrams, Flowcharts, Data Points & Committee Recommendations Ready Reckoners',
        'Weekly Submission Review & Template Refinement by Indrajeet Sir',
      ],
    },
  ];

  final List<Map<String, dynamic>> _defaultResourcesFallback = [
    {
      'id': 'pdf-1',
      'title': 'UPSC 2027 Master Micro-Syllabus & 600+ Topic Blueprint',
      'description': 'Topic-wise breakdown of GS Paper 1, 2, 3 and 4 with direct PYQ trend tags and core keywords.',
      'tag': 'Micro-Syllabus',
      'size': '2.4 MB',
      'fileUrl': 'https://indrajeetsir.com/Course_Brochure_Indrajeet_Sir.pdf',
    },
    {
      'id': 'pdf-2',
      'title': 'Indrajeet Sir Model Evaluated Mains Answer Copy (GS 2 & Ethics)',
      'description': 'Real evaluated copies with Intro-Body-Conclusion framework, 2nd ARC citations, and case law value addition.',
      'tag': 'Model Copies',
      'size': '3.8 MB',
      'fileUrl': 'https://indrajeetsir.com/Course_Brochure_Indrajeet_Sir.pdf',
    },
    {
      'id': 'pdf-3',
      'title': 'Prelims PYQ Reverse Engineering Framework & Theme Mapping',
      'description': 'Strategic guide on how past 10-year UPSC questions predict upcoming themes and option-elimination tactics.',
      'tag': 'PYQ Strategy',
      'size': '1.9 MB',
      'fileUrl': 'https://indrajeetsir.com/Course_Brochure_Indrajeet_Sir.pdf',
    },
    {
      'id': 'pdf-4',
      'title': 'Official UPSC CSE Mentorship Brochure & Roadmap 2026-27',
      'description': 'Complete program curriculum, 5-Pillar methodology, 16 test series timeline and mentor guidance framework.',
      'tag': 'Official Brochure',
      'size': '4.2 MB',
      'fileUrl': 'https://indrajeetsir.com/Course_Brochure_Indrajeet_Sir.pdf',
    },
  ];

  @override
  void initState() {
    super.initState();
    _courses = List.from(_defaultCoursesFallback);
    _resources = List.from(_defaultResourcesFallback);
    _loadHomeData();
  }

  Future<void> _loadHomeData() async {
    try {
      final coursesFuture = ApiService.fetchCourses();
      final resourcesFuture = ApiService.fetchResources();

      final results = await Future.wait([coursesFuture, resourcesFuture]);
      final liveCourses = results[0];
      final liveResources = results[1];

      if (mounted) {
        setState(() {
          if (liveCourses.isNotEmpty) {
            _courses = liveCourses;
          }
          if (liveResources.isNotEmpty) {
            _resources = liveResources;
          }
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Widget _buildBannerFallback(String title, String tag, bool isDark) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDark
              ? [const Color(0xFF0F172A), const Color(0xFF1E293B), const Color(0xFF1E3A8A)]
              : [const Color(0xFF1E3A8A), const Color(0xFF2563EB), const Color(0xFF3B82F6)],
        ),
      ),
      child: Center(
        child: Image.asset(
          'assets/images/logo.png',
          width: 50,
          height: 50,
          opacity: const AlwaysStoppedAnimation(0.25),
          errorBuilder: (_, __, ___) => const SizedBox.shrink(),
        ),
      ),
    );
  }

  Widget _buildCourseCard(BuildContext context, Map<String, dynamic> course, bool isDark) {
    final price = course['price'] ?? 0;
    final int origPrice = course['originalPrice'] != null
        ? course['originalPrice']
        : ((price is int ? price : int.tryParse(price.toString()) ?? 0) * 2.5).round();
    final String discount = course['discount'] ?? '${((origPrice - (price is int ? price : 0)) / (origPrice > 0 ? origPrice : 1) * 100).round()}% OFF';
    final String tag = course['tag'] ?? 'Flagship Batch';
    final String validity = course['validity'] ?? 'Full Batch Access';
    final String title = course['title'] ?? 'UPSC Mentorship Program';
    final String description = course['description'] ?? 'Comprehensive personal guidance with Indrajeet Sir.';
    final List<dynamic> features = course['features'] is List ? course['features'] : [];
    final String? thumb = course['thumbnail'];

    return IosGlassCard(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 16:9 Banner Box (Clean Image - No Overlay Pills)
          Container(
            width: double.infinity,
            height: 165,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
              border: Border.all(
                color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.06),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: thumb != null && thumb.startsWith('http') && !thumb.endsWith('.svg')
                  ? Image.network(
                      thumb,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _buildBannerFallback(title, tag, isDark),
                    )
                  : _buildBannerFallback(title, tag, isDark),
            ),
          ),
          const SizedBox(height: 14),

          // Title
          Text(
            title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 15.5,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 5),

          // Short Description
          Text(
            description,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 12,
              height: 1.4,
              color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
            ),
          ),
          const SizedBox(height: 12),

          // Price Row
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                '₹${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: IosTheme.primaryBlue,
                  letterSpacing: -0.4,
                ),
              ),
              const SizedBox(width: 8),
              if (origPrice > 0)
                Text(
                  '₹${origPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                  style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                    color: CupertinoColors.systemGrey,
                    decoration: TextDecoration.lineThrough,
                  ),
                ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  discount,
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF059669),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Validity Row
          Row(
            children: [
              const Icon(CupertinoIcons.calendar, size: 12, color: CupertinoColors.systemGrey),
              const SizedBox(width: 5),
              Text(
                validity,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: CupertinoColors.systemGrey,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Action Button
          SizedBox(
            width: double.infinity,
            child: CupertinoButton(
              color: IosTheme.primaryBlue,
              padding: const EdgeInsets.symmetric(vertical: 11),
              borderRadius: BorderRadius.circular(12),
              onPressed: () => _showCourseDetailsSheet(context, course),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'View Curriculum & Enroll',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(width: 6),
                  Icon(CupertinoIcons.arrow_up_right, size: 14, color: Colors.white),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResourceCard(BuildContext context, Map<String, dynamic> resource, bool isDark) {
    final title = resource['title'] ?? 'UPSC Study Document';
    final desc = resource['description'] ?? 'Free revision notes and frameworks prepared by Indrajeet Sir.';
    final tag = resource['tag'] ?? 'Study Notes';
    final size = resource['size'] ?? 'PDF';
    final fileUrl = resource['fileUrl'] ?? 'https://indrajeetsir.com/Course_Brochure_Indrajeet_Sir.pdf';
    final fullUrl = fileUrl.startsWith('http') ? fileUrl : 'https://indrajeetsir.com$fileUrl';

    void openPdf() {
      Navigator.push(
        context,
        CupertinoPageRoute(
          builder: (ctx) => PdfViewerScreen(
            title: title,
            url: fullUrl,
          ),
        ),
      );
    }

    return GestureDetector(
      onTap: openPdf,
      child: IosGlassCard(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFFEF4444).withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFEF4444).withValues(alpha: 0.25)),
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  FaIcon(FontAwesomeIcons.filePdf, size: 18, color: Color(0xFFEF4444)),
                  SizedBox(height: 2),
                  Text(
                    'PDF',
                    style: TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFFDC2626),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: IosTheme.primaryBlue.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          tag,
                          style: const TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w700,
                            color: IosTheme.primaryBlue,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '• $size',
                        style: const TextStyle(
                          fontSize: 10,
                          color: CupertinoColors.systemGrey,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.2,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    desc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11,
                      height: 1.35,
                      color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                    ),
                  ),
                  const SizedBox(height: 10),
                  CupertinoButton(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    color: IosTheme.primaryBlue.withValues(alpha: isDark ? 0.25 : 0.12),
                    borderRadius: BorderRadius.circular(8),
                    minimumSize: Size.zero,
                    onPressed: openPdf,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(CupertinoIcons.doc_text_fill, size: 12, color: IosTheme.primaryBlue),
                        const SizedBox(width: 6),
                        Text(
                          'Open PDF',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: isDark ? Colors.white : IosTheme.primaryBlue,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCourseDetailsSheet(BuildContext context, Map<String, dynamic> course) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final title = course['title'] ?? 'Mentorship Batch';
    final price = course['price'] ?? 0;
    final validity = course['validity'] ?? '1 Year';
    final List<dynamic> features = course['features'] is List ? course['features'] : [];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(context).size.height * 0.75,
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: CupertinoColors.systemGrey4,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                  ),
                ),
                CupertinoButton(
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  child: const Icon(CupertinoIcons.xmark_circle_fill, color: CupertinoColors.systemGrey),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              'Fee: ₹${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')} • $validity Access',
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: IosTheme.primaryBlue),
            ),
            const SizedBox(height: 14),
            const Text(
              'Curriculum Features & Deliverables:',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: CupertinoColors.systemGrey),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: ListView.separated(
                physics: const BouncingScrollPhysics(),
                itemCount: features.length,
                separatorBuilder: (_, __) => Divider(height: 16, color: IosTheme.separator(isDark)),
                itemBuilder: (_, i) => Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(CupertinoIcons.checkmark_circle_fill, size: 16, color: Color(0xFF10B981)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        features[i].toString(),
                        style: const TextStyle(fontSize: 12.5, height: 1.35),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: IosTheme.separator(isDark)),
              ),
              child: const Row(
                children: [
                  Icon(CupertinoIcons.info_circle_fill, size: 16, color: IosTheme.primaryBlue),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'All batch enrollments & GST receipts are processed securely at indrajeetsir.com/courses',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: CupertinoButton.filled(
                borderRadius: BorderRadius.circular(14),
                onPressed: () {
                  Navigator.pop(ctx);
                  WebRedirectService.redirectToEnrollment(
                    context,
                    profile: widget.profile,
                    courseId: course['id']?.toString(),
                    courseTitle: title,
                  );
                },
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(CupertinoIcons.arrow_up_right_square_fill, size: 16, color: Colors.white),
                    SizedBox(width: 8),
                    Text(
                      'Proceed to Official Enrollment',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDhoniQuoteCard(BuildContext context, bool isDark) {
    return IosGlassCard(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)]),
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Text(
                    '#7',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'MS Dhoni',
                    style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800),
                  ),
                  Text(
                    'Mentorship Mindset & Core Philosophy',
                    style: TextStyle(
                      fontSize: 10,
                      color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            '“The process is more important than the results. If you take care of the process, results will follow.”',
            style: TextStyle(
              fontSize: 13,
              fontStyle: FontStyle.italic,
              height: 1.45,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white70 : const Color(0xFF1E293B),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadHomeData,
          color: IosTheme.primaryBlue,
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
            slivers: [
              // iOS Large Title Header
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'UPSC CSE ${widget.profile.attemptYear.toUpperCase()}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.8,
                                color: IosTheme.primaryBlue,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Welcome, ${widget.profile.name.split(' ')[0]}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.6,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CupertinoButton(
                            padding: EdgeInsets.zero,
                            minimumSize: Size.zero,
                            onPressed: widget.onThemeToggle,
                            child: Container(
                              width: 38,
                              height: 38,
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF2C2C2E) : Colors.white,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isDark ? Colors.white.withValues(alpha: 0.1) : Colors.black.withValues(alpha: 0.06),
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
                                    blurRadius: 10,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Icon(
                                isDark ? CupertinoIcons.sun_max_fill : CupertinoIcons.moon_fill,
                                size: 18,
                                color: isDark ? const Color(0xFFFFCC00) : IosTheme.systemIndigo,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          GestureDetector(
                            onTap: () => widget.onNavigateTab(3),
                            child: Container(
                              padding: const EdgeInsets.all(2),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(color: IosTheme.primaryBlue, width: 2),
                              ),
                              child: CircleAvatar(
                                radius: 19,
                                backgroundColor: IosTheme.primaryBlue.withValues(alpha: 0.12),
                                child: Text(widget.profile.avatarDisplayEmoji, style: const TextStyle(fontSize: 19)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Content List
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 140),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // Enrolled Course Status Banner
                    IosGlassCard(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: IosTheme.primaryBlue.withValues(alpha: 0.35), width: 1.5),
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                'assets/images/logo.png',
                                width: 44,
                                height: 44,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) => const Icon(
                                  CupertinoIcons.book_fill,
                                  color: IosTheme.primaryBlue,
                                  size: 20,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: const Text(
                                        'ENROLLED COURSE',
                                        style: TextStyle(
                                          fontSize: 9.5,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF059669),
                                          letterSpacing: 0.4,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    const Text(
                                      '• 10m Alerts Active',
                                      style: TextStyle(
                                        fontSize: 10,
                                        color: CupertinoColors.systemGrey,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  widget.profile.enrolledCourse,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Upcoming Live Session Hero Card
                    IosGlassCard(
                      padding: const EdgeInsets.all(20),
                      backgroundColor: isDark
                          ? const Color(0xFF1E293B).withValues(alpha: 0.7)
                          : const Color(0xFFEFF6FF),
                      border: Border.all(
                        color: IosTheme.primaryBlue.withValues(alpha: isDark ? 0.3 : 0.2),
                        width: 1.2,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: widget.upcomingClass != null ? IosTheme.primaryBlue : CupertinoColors.systemGrey,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(CupertinoIcons.circle_fill, size: 8, color: Colors.white),
                                    const SizedBox(width: 5),
                                    Text(
                                      widget.upcomingClass != null ? 'UPCOMING LIVE SESSION' : 'LIVE STATUS',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 10.5,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                widget.upcomingClass != null
                                    ? '${widget.upcomingClass!['date'] ?? 'Today'} • ${widget.upcomingClass!['time'] ?? '7:00 PM'}'
                                    : 'Awaiting Schedule',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: CupertinoColors.systemGrey),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          Text(
                            widget.upcomingClass != null
                                ? (widget.upcomingClass!['title'] ?? 'Direct Mentorship Session')
                                : 'No Live Sessions Scheduled Right Now',
                            style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, letterSpacing: -0.3),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            widget.upcomingClass != null
                                ? 'Interactive Live Strategy Class with Indrajeet Sir'
                                : 'Live sessions will appear here automatically once scheduled by Indrajeet Sir.',
                            style: TextStyle(
                              fontSize: 13,
                              color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: CupertinoButton(
                                  color: IosTheme.primaryBlue,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  borderRadius: BorderRadius.circular(14),
                                  onPressed: () => widget.onNavigateTab(1),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const FaIcon(FontAwesomeIcons.video, size: 14, color: Colors.white),
                                      const SizedBox(width: 8),
                                      Text(
                                        widget.upcomingClass != null ? 'Join Live Classroom' : 'Open Classroom Schedule',
                                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: Colors.white),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // ══════════════════════════════════════════════════════════
                    // ── SECTION 3: MENTORSHIP COURSES & PROGRAMS ──────────────
                    // ══════════════════════════════════════════════════════════
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'MENTORSHIP PROGRAMS & BATCHES',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.6,
                            color: CupertinoColors.systemGrey,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            WebRedirectService.redirectToEnrollment(
                              context,
                              profile: widget.profile,
                            );
                          },
                          child: const Row(
                            children: [
                              Text(
                                'Web Portal',
                                style: TextStyle(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w700,
                                  color: IosTheme.primaryBlue,
                                ),
                              ),
                              SizedBox(width: 2),
                              Icon(CupertinoIcons.arrow_up_right, size: 12, color: IosTheme.primaryBlue),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '1-on-1 strategy sessions, daily Mains evaluation & structured roadmaps',
                      style: TextStyle(
                        fontSize: 11.5,
                        color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Render Course Cards
                    ..._courses.map((c) => _buildCourseCard(context, c, isDark)),

                    const SizedBox(height: 12),

                    // ══════════════════════════════════════════════════════════
                    // ── SECTION 4: FREE STUDY MATERIAL & VALUE ADDITION NOTES ─
                    // ══════════════════════════════════════════════════════════
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'FREE STUDY MATERIAL & NOTES',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.6,
                            color: CupertinoColors.systemGrey,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'FREE PDFS',
                            style: TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF059669),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Curated micro-syllabus, PYQ reverse frameworks & model evaluated copies',
                      style: TextStyle(
                        fontSize: 11.5,
                        color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Render Free Resource Cards
                    ..._resources.map((r) => _buildResourceCard(context, r, isDark)),

                    const SizedBox(height: 18),

                    // ══════════════════════════════════════════════════════════
                    // ── SECTION 5: MS DHONI MENTORSHIP PHILOSOPHY ─────────────
                    // ══════════════════════════════════════════════════════════
                    _buildDhoniQuoteCard(context, isDark),

                    // ══════════════════════════════════════════════════════════
                    // ── SECTION 6: LIVE CLASSROOM SCHEDULE & GUIDELINES ───────
                    // ══════════════════════════════════════════════════════════
                    const Padding(
                      padding: EdgeInsets.only(left: 4, bottom: 10),
                      child: Text(
                        'LIVE CLASS GUIDELINES',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.6,
                          color: CupertinoColors.systemGrey,
                        ),
                      ),
                    ),

                    IosGlassCard(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          _buildGuidelineItem(
                            context,
                            icon: FontAwesomeIcons.headphones,
                            color: IosTheme.primaryBlue,
                            title: 'Audio & Microphone Ready',
                            subtitle: 'Connect headphones with mic for smooth two-way live interaction with Indrajeet Sir.',
                          ),
                          Divider(height: 24, indent: 44, color: IosTheme.separator(isDark)),
                          _buildGuidelineItem(
                            context,
                            icon: FontAwesomeIcons.wifi,
                            color: IosTheme.systemGreen,
                            title: 'Stable Connection Required',
                            subtitle: 'Ensure high-speed Wi-Fi or 4G/5G connectivity for uninterrupted HD video stream.',
                          ),
                          Divider(height: 24, indent: 44, color: IosTheme.separator(isDark)),
                          _buildGuidelineItem(
                            context,
                            icon: FontAwesomeIcons.bookOpen,
                            color: IosTheme.systemOrange,
                            title: 'Keep Notebooks Ready',
                            subtitle: 'Keep your notes and questions handy during the live classroom interaction.',
                          ),
                        ],
                      ),
                    ),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricTile(
    BuildContext context, {
    required String title,
    required String value,
    required String subtitle,
    required FaIconData icon,
    required Color color,
  }) {
    return IosGlassCard(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              FaIcon(icon, size: 18, color: color),
              const Spacer(),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, letterSpacing: -0.4),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: CupertinoColors.systemGrey, letterSpacing: 0.4),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 11, color: CupertinoColors.systemGrey),
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleRow(
    BuildContext context, {
    required String time,
    required String title,
    required String type,
    required bool isAssigned,
    required VoidCallback onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return CupertinoButton(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      onPressed: onTap,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(
              color: isAssigned
                  ? IosTheme.systemOrange.withValues(alpha: 0.15)
                  : IosTheme.primaryBlue.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              time,
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w800,
                color: isAssigned ? IosTheme.systemOrange : IosTheme.primaryBlue,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  type,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.3,
                    color: isAssigned ? IosTheme.systemOrange : CupertinoColors.systemGrey,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          const Icon(CupertinoIcons.chevron_right, size: 14, color: CupertinoColors.systemGrey3),
        ],
      ),
    );
  }

  Widget _buildGuidelineItem(
    BuildContext context, {
    required FaIconData icon,
    required Color color,
    required String title,
    required String subtitle,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(7),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: FaIcon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                  color: isDark ? Colors.white : Colors.black,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 12,
                  height: 1.35,
                  color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ============================================================================
// 4. LIVE CLASSROOM SCREEN (iOS HIG DESIGN)
// ============================================================================
class LiveSessionsScreen extends StatefulWidget {
  final StudentProfile profile;

  const LiveSessionsScreen({super.key, required this.profile});

  @override
  State<LiveSessionsScreen> createState() => _LiveSessionsScreenState();
}

class _LiveSessionsScreenState extends State<LiveSessionsScreen> {
  int _selectedSegment = 0; // 0: Live Classroom, 1: Programs & Admissions
  bool _isLoading = false;
  List<Map<String, dynamic>> _classes = [];
  List<Map<String, dynamic>> _courses = [];

  final List<Map<String, dynamic>> _officialCoursesFallback = [
    {
      'id': 'c-1',
      'title': '1 Year Full Mentorship for UPSC 2027 (After Foundation Course)',
      'description': 'Complete 3-Stage Prelims, Mains, and Interview guidance with 1-on-1 personal mentorship by Indrajeet Sir.',
      'price': 24000,
      'validity': '1 Year',
      'tag': 'Complete Mentorship (Post-FC)',
      'features': [
        'Prelims: High-yield Notes, PYQ+, 20 Mock Tests, 5,000+ Questions',
        'Mains: Short Notes, Trend Analysis, Toppers Copy, 16 Evaluated Tests',
        'Weekly Strategy Sessions & 1-on-1 Mentorship with Indrajeet Sir',
        'Interview: Personality Development & Newspaper Analysis',
      ],
    },
    {
      'id': 'c-2',
      'title': 'UPSC Mains 2027 Comprehensive Mentorship',
      'description': 'Targeted Mains score maximization with personal copy evaluation and structure improvement by Indrajeet Sir.',
      'price': 18000,
      'validity': '4–5 Months',
      'tag': 'Mains Score Booster',
      'features': [
        'High-Yield Mains Short Note Making Framework',
        'Deep PYQ Trend Analysis & Theme Mapping',
        'Toppers Copy In-Depth Structure & Presentation Analysis',
        '16 Evaluated Tests with Line-by-Line Feedback from Sir',
      ],
    },
    {
      'id': 'c-3',
      'title': 'UPSC Prelims 2027 Targeted Program',
      'description': 'Build rigorous elimination skills, concise revision notes, and solve 5,000+ targeted practice questions.',
      'price': 10000,
      'validity': '5–6 Months',
      'tag': 'Prelims Special',
      'features': [
        'Micro Notes Making & Core Conceptual Clarity',
        'PYQ+ Strategy (Pattern Recognition & Elimination)',
        '20 Comprehensive Mock Tests with Diagnostics',
        'Total 5,000+ Curated Practice Questions',
      ],
    },
    {
      'id': 'c-4',
      'title': '1 Year Full Mentorship for UPSC 2027 / 2028 (Parallel with Foundation Course)',
      'description': 'Align and strengthen your preparation alongside your ongoing foundation course (Note: We do not provide foundation lectures).',
      'price': 30000,
      'validity': '18 Months',
      'tag': 'Foundation Parallel Batch',
      'features': [
        'Complete 3-Stage Support: Prelims + Mains + Interview Mentorship',
        'Prelims: Notes, PYQ+, 20 Mock Tests, 5,000+ Questions',
        'Mains: Short Notes, PYQ Analysis, 16 Evaluated Tests',
        'Validity: 18 Months Extended Mentorship Support',
      ],
    },
    {
      'id': 'c-5',
      'title': 'UPSC Mains Short Notes Making',
      'description': 'Master the art of creating 1-2 page crisp, high-yield revision sheets for all 4 GS papers under direct guidance of Indrajeet Sir.',
      'price': 4500,
      'validity': '3 Months',
      'tag': 'Micro-Notes Mastery',
      'features': [
        'Complete GS 1, 2, 3 & 4 Theme-Wise Micro Notes Framework',
        'Data, Factsheets, Case Studies & Committee Recommendations',
        'How to Condense 50-page topics into 1 memorable sheet',
        'Personal Feedback on Notes Quality by Indrajeet Sir',
      ],
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final remoteClasses = await ApiService.fetchLiveClasses();
    final remoteCourses = await ApiService.fetchCourses();
    if (mounted) {
      setState(() {
        _classes = remoteClasses;
        _courses = remoteCourses.isNotEmpty ? remoteCourses : _officialCoursesFallback;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Classroom & Batches',
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, letterSpacing: -0.6),
                  ),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: _loadData,
                    child: const Icon(CupertinoIcons.arrow_clockwise, size: 20),
                  ),
                ],
              ),
            ),

            // iOS Sliding Segmented Control
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
              child: SizedBox(
                width: double.infinity,
                child: CupertinoSlidingSegmentedControl<int>(
                  groupValue: _selectedSegment,
                  backgroundColor: isDark ? const Color(0xFF1C1C1E) : const Color(0xFFE5E5EA),
                  thumbColor: isDark ? const Color(0xFF2C2C2E) : Colors.white,
                  children: const {
                    0: Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: Text('Live Classroom', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                    1: Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: Text('Programs & Admissions', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                  },
                  onValueChanged: (val) {
                    if (val != null) setState(() => _selectedSegment = val);
                  },
                ),
              ),
            ),
            const SizedBox(height: 8),

            // ─── TAB 0: LIVE CLASSROOM ─────────────────────────────────────────
            if (_selectedSegment == 0)
              Expanded(
                child: _isLoading
                    ? const Center(child: CupertinoActivityIndicator())
                    : _classes.isEmpty
                        ? Center(
                            child: Padding(
                              padding: const EdgeInsets.all(32),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(18),
                                    decoration: BoxDecoration(
                                      color: IosTheme.primaryBlue.withValues(alpha: 0.1),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const FaIcon(FontAwesomeIcons.calendarCheck, size: 36, color: IosTheme.primaryBlue),
                                  ),
                                  const SizedBox(height: 16),
                                  const Text(
                                    'No Live Sessions Scheduled',
                                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    'Live classes and personal strategy sessions will appear here as soon as scheduled by Indrajeet Sir.',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )
                        : ListView.builder(
                            physics: const BouncingScrollPhysics(),
                            padding: const EdgeInsets.fromLTRB(20, 8, 20, 140),
                            itemCount: _classes.length,
                            itemBuilder: (context, index) {
                              final cls = _classes[index];
                              final isAllottedToStudent = (cls['assignedStudent'] ?? '').toString().toLowerCase().contains(widget.profile.name.toLowerCase()) ||
                                  (widget.profile.name.isNotEmpty && cls['assignedStudent'] == widget.profile.name);

                              return IosGlassCard(
                                margin: const EdgeInsets.only(bottom: 14),
                                padding: const EdgeInsets.all(18),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: isAllottedToStudent
                                                ? IosTheme.systemOrange.withValues(alpha: 0.15)
                                                : IosTheme.primaryBlue.withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            isAllottedToStudent ? 'PERSONAL MENTEE' : 'BATCH MASTERCLASS',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w800,
                                              color: isAllottedToStudent ? IosTheme.systemOrange : IosTheme.primaryBlue,
                                            ),
                                          ),
                                        ),
                                        Text(
                                          '${cls['date']} • ${cls['time']}',
                                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: CupertinoColors.systemGrey),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      cls['title'] ?? 'Session',
                                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Mentor: ${cls['instructor'] ?? 'Indrajeet Sir'}',
                                      style: TextStyle(
                                        fontSize: 12.5,
                                        color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                                      ),
                                    ),
                                    const SizedBox(height: 14),
                                    SizedBox(
                                      width: double.infinity,
                                      child: CupertinoButton.filled(
                                        padding: const EdgeInsets.symmetric(vertical: 10),
                                        borderRadius: BorderRadius.circular(12),
                                        onPressed: () {
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            const SnackBar(content: Text('Launching classroom video stream...')),
                                          );
                                        },
                                        child: const Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Icon(CupertinoIcons.videocam_fill, size: 16, color: Colors.white),
                                            SizedBox(width: 6),
                                            Text('Join Live Session', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
              )

            // ─── TAB 1: PROGRAMS & ADMISSIONS (WEBSITE PURCHASES ONLY) ─────────
            else
              Expanded(
                child: ListView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 140),
                  children: [
                    // Official Website Purchase Policy Callout
                    Container(
                      padding: const EdgeInsets.all(14),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.25)),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(CupertinoIcons.shield_lefthalf_fill, color: Color(0xFF059669), size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Website-Only Enrollment Policy',
                                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF065F46)),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'All program enrollments, batch admissions, and fee payments are exclusively processed on our secure website portal (indrajeetsir.com). In-app payments are not charged.',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isDark ? const Color(0xFFA7F3D0) : const Color(0xFF047857),
                                    height: 1.35,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    for (final crs in (_courses.isNotEmpty ? _courses : _officialCoursesFallback)) ...[
                      IosGlassCard(
                        margin: const EdgeInsets.only(bottom: 14),
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                if (crs['tag'] != null)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: IosTheme.primaryBlue.withValues(alpha: 0.12),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      crs['tag'].toString().toUpperCase(),
                                      style: const TextStyle(
                                        fontSize: 9.5,
                                        fontWeight: FontWeight.w800,
                                        color: IosTheme.primaryBlue,
                                      ),
                                    ),
                                  ),
                                Text(
                                  '₹${(crs['price'] ?? 0).toString().replaceAllMapped(RegExp(r'(\\d{1,3})(?=(\\d{3})+(?!\\d))'), (Match m) => '${m[1]},')}',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF10B981),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              crs['title'] ?? 'Mentorship Program',
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                            ),
                            if (crs['validity'] != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                'Validity: ${crs['validity']}',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: CupertinoColors.systemGrey),
                              ),
                            ],
                            const SizedBox(height: 8),
                            Text(
                              crs['description'] ?? '',
                              style: TextStyle(
                                fontSize: 12.5,
                                color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                                height: 1.35,
                              ),
                            ),
                            if (crs['features'] != null && crs['features'] is List) ...[
                              const SizedBox(height: 12),
                              for (final f in (crs['features'] as List).take(3))
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Icon(CupertinoIcons.checkmark_circle_fill, size: 14, color: Color(0xFF10B981)),
                                      const SizedBox(width: 6),
                                      Expanded(
                                        child: Text(
                                          f.toString(),
                                          style: const TextStyle(fontSize: 11.5, height: 1.3),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: CupertinoButton.filled(
                                padding: const EdgeInsets.symmetric(vertical: 10),
                                borderRadius: BorderRadius.circular(12),
                                onPressed: () {
                                  WebRedirectService.redirectToEnrollment(
                                    context,
                                    profile: widget.profile,
                                    courseId: crs['id']?.toString(),
                                    courseTitle: crs['title'],
                                  );
                                },
                                child: const Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(CupertinoIcons.globe, size: 16, color: Colors.white),
                                    SizedBox(width: 8),
                                    Text('Enroll on Official Website →', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
// ============================================================================
// 5. MENTORSHIP CHAT SCREEN (APPLE iMESSAGE STYLE)
// ============================================================================
// ============================================================================
// 5. MENTORSHIP CHAT SCREEN (WITH FILE ATTACHMENTS & 2-MIN EDIT COOLDOWN)
// ============================================================================
class ChatScreen extends StatefulWidget {
  final StudentProfile profile;

  const ChatScreen({super.key, required this.profile});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  String? _selectedFileName;
  String? _selectedFileType;

  final List<Map<String, dynamic>> _messages = [
    {
      'id': 'm-seed-1',
      'sender': 'Indrajeet Sir',
      'text': 'Welcome to your 1:1 Mentorship channel! Did you review the Mains Case Study outline for Ethics Paper 4?',
      'time': '10:00 AM',
      'createdAtMs': DateTime.now().subtract(const Duration(minutes: 30)).millisecondsSinceEpoch,
      'isEdited': false,
    },
    {
      'id': 'm-seed-2',
      'sender': 'Student Aspirant',
      'text': 'Yes sir, submitted my response sheet on the portal. Ready for your review.',
      'time': '10:05 AM',
      'createdAtMs': DateTime.now().subtract(const Duration(minutes: 25)).millisecondsSinceEpoch,
      'fileName': 'Ethics_CaseStudy_Ans.pdf',
      'fileType': 'PDF Document (2.4 MB)',
      'isEdited': false,
    },
    {
      'id': 'm-seed-3',
      'sender': 'Indrajeet Sir',
      'text': 'Excellent. We will evaluate your answer during tonight\'s live strategy review call at 7:00 PM.',
      'time': '10:12 AM',
      'createdAtMs': DateTime.now().subtract(const Duration(minutes: 18)).millisecondsSinceEpoch,
      'isEdited': false,
    },
  ];

  @override
  void initState() {
    super.initState();
    _fetchRemote();
  }

  Future<void> _fetchRemote() async {
    final remote = await ApiService.fetchMessages();
    if (remote.isNotEmpty && mounted) {
      setState(() {
        for (final r in remote) {
          final exists = _messages.any((m) => m['id'] == r['id']);
          if (!exists) _messages.add(r);
        }
      });
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _pickRealFile() async {
    try {
      final files = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
      );

      if (files.isNotEmpty) {
        final file = files.first;
        final ext = (file.extension ?? 'PDF').toUpperCase();

        setState(() {
          _selectedFileName = file.name;
          _selectedFileType = '$ext Document';
        });
      }
    } catch (e) {
      debugPrint('File picker error: $e');
    }
  }

  Future<void> _send() async {
    final text = _msgController.text.trim();
    if (text.isEmpty && _selectedFileName == null) return;

    final now = DateTime.now();
    final newMsg = {
      'id': 'm-${now.millisecondsSinceEpoch}',
      'sender': widget.profile.name,
      'text': text,
      'time': '${now.hour > 12 ? now.hour - 12 : now.hour}:${now.minute.toString().padLeft(2, '0')} ${now.hour >= 12 ? 'PM' : 'AM'}',
      'createdAtMs': now.millisecondsSinceEpoch,
      'fileName': _selectedFileName,
      'fileType': _selectedFileType,
      'isEdited': false,
    };

    setState(() {
      _messages.add(newMsg);
      _msgController.clear();
      _selectedFileName = null;
      _selectedFileType = null;
    });

    _scrollToBottom();

    await ApiService.sendMessage(
      studentName: widget.profile.name,
      text: text,
      fileName: newMsg['fileName'] as String?,
      fileType: newMsg['fileType'] as String?,
    );
  }

  void _openEditDialog(Map<String, dynamic> msg) {
    final createdAtMs = (msg['createdAtMs'] ?? 0) as int;
    final elapsedSec = ((DateTime.now().millisecondsSinceEpoch - createdAtMs) / 1000).floor();
    final remainingSec = 120 - elapsedSec;

    if (remainingSec <= 0) {
      showCupertinoDialog(
        context: context,
        builder: (ctx) => CupertinoAlertDialog(
          title: const Text('Edit Window Expired'),
          content: const Text(
            'Messages and shared files can only be modified within 2 minutes of sending.',
          ),
          actions: [
            CupertinoDialogAction(
              child: const Text('OK'),
              onPressed: () => Navigator.pop(ctx),
            ),
          ],
        ),
      );
      return;
    }

    final editCtrl = TextEditingController(text: (msg['text'] ?? '').toString());
    String? editFileName = msg['fileName']?.toString();

    showCupertinoDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return CupertinoAlertDialog(
            title: const Text('Edit Message'),
            content: Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CupertinoTextField(
                    controller: editCtrl,
                    placeholder: 'Edit your message...',
                    maxLines: 3,
                    padding: const EdgeInsets.all(10),
                  ),
                  if (editFileName != null) ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE2E8F0),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              '📎 $editFileName',
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.black87),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => setModalState(() => editFileName = null),
                            child: const Icon(CupertinoIcons.xmark_circle_fill, size: 16, color: Colors.red),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
            actions: [
              CupertinoDialogAction(
                child: const Text('Cancel'),
                onPressed: () => Navigator.pop(ctx),
              ),
              CupertinoDialogAction(
                isDefaultAction: true,
                child: const Text('Save Changes'),
                onPressed: () async {
                  final newText = editCtrl.text.trim();
                  Navigator.pop(ctx);

                  setState(() {
                    msg['text'] = newText;
                    msg['fileName'] = editFileName;
                    if (editFileName == null) msg['fileType'] = null;
                    msg['isEdited'] = true;
                  });

                  await ApiService.editMessage(
                    id: msg['id'] ?? '',
                    text: newText,
                    fileName: editFileName,
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // iOS Chat Nav Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
              child: Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: IosTheme.primaryBlue.withValues(alpha: 0.35), width: 1.5),
                    ),
                    child: ClipOval(
                      child: Image.asset(
                        'assets/images/logo.png',
                        width: 42,
                        height: 42,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: IosTheme.primaryBlue,
                          child: const Center(
                            child: Text('IS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Text(
                              'Indrajeet Sir',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                            ),
                            SizedBox(width: 4),
                            Icon(CupertinoIcons.checkmark_seal_fill, size: 14, color: IosTheme.primaryBlue),
                          ],
                        ),
                        Text(
                          'Direct Mentorship Desk',
                          style: TextStyle(
                            fontSize: 11.5,
                            color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Divider(height: 1, color: IosTheme.separator(isDark)),

            // Messages List
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final msg = _messages[index];
                  final isMe = msg['sender'] == widget.profile.name || msg['sender'] == 'student' || msg['sender'] == 'Student Aspirant';
                  final createdAtMs = (msg['createdAtMs'] ?? 0) as int;
                  final elapsedSec = ((DateTime.now().millisecondsSinceEpoch - createdAtMs) / 1000).floor();
                  final canEdit = isMe && elapsedSec <= 120;

                  return Align(
                    alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: isMe
                            ? IosTheme.primaryBlue
                            : (isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE9E9EB)),
                        borderRadius: BorderRadius.only(
                          topLeft: const Radius.circular(18),
                          topRight: const Radius.circular(18),
                          bottomLeft: Radius.circular(isMe ? 18 : 4),
                          bottomRight: Radius.circular(isMe ? 4 : 18),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                        children: [
                          // Attached File Box
                          if (msg['fileName'] != null && (msg['fileName'] as String).isNotEmpty) ...[
                            Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: isMe
                                    ? Colors.black.withValues(alpha: 0.20)
                                    : (isDark ? const Color(0xFF1C1C1E) : Colors.white),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isMe
                                      ? Colors.white.withValues(alpha: 0.2)
                                      : (isDark ? const Color(0xFF3A3A3C) : const Color(0xFFE2E8F0)),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: BoxDecoration(
                                      color: isMe ? Colors.white.withValues(alpha: 0.2) : const Color(0xFFEFF6FF),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Icon(
                                      CupertinoIcons.doc_fill,
                                      size: 18,
                                      color: isMe ? Colors.white : IosTheme.primaryBlue,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Flexible(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          msg['fileName']!,
                                          style: TextStyle(
                                            color: isMe ? Colors.white : (isDark ? Colors.white : Colors.black87),
                                            fontSize: 12.5,
                                            fontWeight: FontWeight.w700,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        Text(
                                          msg['fileType'] ?? 'Document Attachment',
                                          style: TextStyle(
                                            color: isMe ? Colors.white70 : CupertinoColors.systemGrey,
                                            fontSize: 10.5,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],

                          // Text Content
                          if ((msg['text'] ?? '').toString().isNotEmpty)
                            Text(
                              msg['text']!,
                              style: TextStyle(
                                color: isMe ? Colors.white : (isDark ? Colors.white : Colors.black),
                                fontSize: 14.5,
                                height: 1.35,
                              ),
                            ),
                          const SizedBox(height: 4),

                          // Timestamp, Edit Status & 2-min Edit Button
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (msg['isEdited'] == true) ...[
                                Text(
                                  '(edited) ',
                                  style: TextStyle(
                                    color: isMe ? Colors.white60 : CupertinoColors.systemGrey,
                                    fontSize: 10,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ],
                              Text(
                                (msg['time'] ?? msg['timestamp'] ?? '').toString(),
                                style: TextStyle(
                                  color: isMe ? Colors.white70 : CupertinoColors.systemGrey,
                                  fontSize: 10,
                                ),
                              ),
                              if (isMe) ...[
                                const SizedBox(width: 8),
                                if (canEdit)
                                  GestureDetector(
                                    onTap: () => _openEditDialog(msg),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.22),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(CupertinoIcons.pencil, size: 10, color: Colors.white),
                                          const SizedBox(width: 3),
                                          Text(
                                            'Edit',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 9.5,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  )
                                else
                                  const SizedBox.shrink(),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // File Attachment Selected Banner
            if (_selectedFileName != null)
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: IosTheme.primaryBlue.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(CupertinoIcons.paperclip, size: 16, color: IosTheme.primaryBlue),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _selectedFileName!,
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w600,
                          color: isDark ? Colors.white : Colors.black87,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setState(() {
                        _selectedFileName = null;
                        _selectedFileType = null;
                      }),
                      child: const Icon(CupertinoIcons.xmark_circle_fill, size: 18, color: Colors.grey),
                    ),
                  ],
                ),
              ),

            // iOS Frosted Input Bar (Floated above bottom tab dock)
            Container(
              padding: EdgeInsets.fromLTRB(
                10,
                8,
                12,
                MediaQuery.of(context).padding.bottom + 84,
              ),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
                border: Border(top: BorderSide(color: IosTheme.separator(isDark))),
              ),
              child: Row(
                children: [
                  // Attachment Paperclip Button
                  CupertinoButton(
                    padding: const EdgeInsets.all(8),
                    minimumSize: Size.zero,
                    onPressed: _pickRealFile,
                    child: FaIcon(
                      FontAwesomeIcons.paperclip,
                      size: 18,
                      color: isDark ? CupertinoColors.systemGrey : const Color(0xFF4B5563),
                    ),
                  ),
                  Expanded(
                    child: CupertinoTextField(
                      controller: _msgController,
                      placeholder: 'Message Indrajeet Sir...',
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF2F2F7),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      style: TextStyle(color: isDark ? Colors.white : Colors.black),
                      onSubmitted: (_) => _send(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    minimumSize: Size.zero,
                    onPressed: _send,
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: const BoxDecoration(
                        color: IosTheme.primaryBlue,
                        shape: BoxShape.circle,
                      ),
                      child: const FaIcon(FontAwesomeIcons.arrowUp, size: 14, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// 6. PROFILE & SETTINGS (APPLE iOS SETTINGS STYLE)
// ============================================================================
class ProfileScreen extends StatelessWidget {
  final VoidCallback onThemeToggle;
  final StudentProfile profile;
  final bool reminderEnabled;
  final ValueChanged<bool> onReminderToggle;
  final Function(StudentProfile) onProfileUpdate;

  const ProfileScreen({
    super.key,
    required this.onThemeToggle,
    required this.profile,
    required this.reminderEnabled,
    required this.onReminderToggle,
    required this.onProfileUpdate,
  });

  void _openEditProfileDialog(BuildContext context) {
    final nameCtrl = TextEditingController(text: profile.name);
    final emailCtrl = TextEditingController(text: profile.email);
    final phoneCtrl = TextEditingController(text: profile.phone);
    final optionalCtrl = TextEditingController(text: profile.optionalSubject);
    final bioCtrl = TextEditingController(text: profile.bio);
    String selectedYear = profile.attemptYear;

    showCupertinoModalPopup(
      context: context,
      builder: (ctx) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Material(
          color: Colors.transparent,
          child: Padding(
            padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
            child: Container(
              height: MediaQuery.of(context).size.height * 0.78,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      CupertinoButton(
                        padding: EdgeInsets.zero,
                        child: const Text('Cancel'),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                      Text(
                        'Edit Profile',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                          decoration: TextDecoration.none,
                          color: isDark ? Colors.white : Colors.black,
                        ),
                      ),
                      CupertinoButton(
                        padding: EdgeInsets.zero,
                        child: const Text('Done', style: TextStyle(fontWeight: FontWeight.w700)),
                        onPressed: () async {
                          profile.name = nameCtrl.text.trim();
                          profile.email = emailCtrl.text.trim();
                          profile.phone = phoneCtrl.text.trim();
                          profile.attemptYear = selectedYear;
                          profile.optionalSubject = optionalCtrl.text.trim();
                          profile.bio = bioCtrl.text.trim();
                          onProfileUpdate(profile);

                          await ApiService.syncProfile(profile);

                          if (context.mounted) {
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Profile changes saved successfully.'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          }
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListView(
                      children: [
                        CupertinoTextField(
                          controller: nameCtrl,
                          placeholder: 'Full Name',
                          placeholderStyle: TextStyle(color: isDark ? Colors.white38 : CupertinoColors.placeholderText, fontSize: 14),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black, fontSize: 14.5),
                          decoration: BoxDecoration(color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF2F2F7), borderRadius: BorderRadius.circular(10)),
                          prefix: Padding(padding: const EdgeInsets.only(left: 10), child: Icon(CupertinoIcons.person, size: 18, color: isDark ? Colors.white70 : CupertinoColors.systemGrey)),
                          padding: const EdgeInsets.all(12),
                        ),
                        const SizedBox(height: 12),
                        CupertinoTextField(
                          controller: emailCtrl,
                          placeholder: 'Email',
                          placeholderStyle: TextStyle(color: isDark ? Colors.white38 : CupertinoColors.placeholderText, fontSize: 14),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black, fontSize: 14.5),
                          decoration: BoxDecoration(color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF2F2F7), borderRadius: BorderRadius.circular(10)),
                          prefix: Padding(padding: const EdgeInsets.only(left: 10), child: Icon(CupertinoIcons.mail, size: 18, color: isDark ? Colors.white70 : CupertinoColors.systemGrey)),
                          padding: const EdgeInsets.all(12),
                        ),
                        const SizedBox(height: 12),
                        CupertinoTextField(
                          controller: phoneCtrl,
                          placeholder: 'Phone / WhatsApp',
                          placeholderStyle: TextStyle(color: isDark ? Colors.white38 : CupertinoColors.placeholderText, fontSize: 14),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black, fontSize: 14.5),
                          decoration: BoxDecoration(color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF2F2F7), borderRadius: BorderRadius.circular(10)),
                          prefix: Padding(padding: const EdgeInsets.only(left: 10), child: Icon(CupertinoIcons.phone, size: 18, color: isDark ? Colors.white70 : CupertinoColors.systemGrey)),
                          padding: const EdgeInsets.all(12),
                        ),
                        const SizedBox(height: 12),
                        CupertinoTextField(
                          controller: optionalCtrl,
                          placeholder: 'Optional Subject',
                          placeholderStyle: TextStyle(color: isDark ? Colors.white38 : CupertinoColors.placeholderText, fontSize: 14),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black, fontSize: 14.5),
                          decoration: BoxDecoration(color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF2F2F7), borderRadius: BorderRadius.circular(10)),
                          prefix: Padding(padding: const EdgeInsets.only(left: 10), child: Icon(CupertinoIcons.book, size: 18, color: isDark ? Colors.white70 : CupertinoColors.systemGrey)),
                          padding: const EdgeInsets.all(12),
                        ),
                        const SizedBox(height: 12),
                        StatefulBuilder(
                          builder: (context, setDialogState) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                children: [
                                  const Text(
                                    'Target Attempt: ',
                                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: CupertinoColors.systemGrey),
                                  ),
                                  const Spacer(),
                                  for (final yr in [
                                    (DateTime.now().year + 1).toString(),
                                    (DateTime.now().year + 2).toString(),
                                    (DateTime.now().year + 3).toString(),
                                  ])
                                    Padding(
                                      padding: const EdgeInsets.only(left: 6),
                                      child: GestureDetector(
                                        onTap: () => setDialogState(() => selectedYear = yr),
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                          decoration: BoxDecoration(
                                            color: selectedYear == yr
                                                ? IosTheme.primaryBlue
                                                : (isDark ? const Color(0xFF2C2C2E) : const Color(0xFFE5E5EA)),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            yr,
                                            style: TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w700,
                                              color: selectedYear == yr ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 12),
                        CupertinoTextField(
                          controller: bioCtrl,
                          placeholder: 'Personal Directive / Bio',
                          placeholderStyle: TextStyle(color: isDark ? Colors.white38 : CupertinoColors.placeholderText, fontSize: 14),
                          style: TextStyle(color: isDark ? Colors.white : Colors.black, fontSize: 14.5),
                          decoration: BoxDecoration(color: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF2F2F7), borderRadius: BorderRadius.circular(10)),
                          maxLines: 2,
                          padding: const EdgeInsets.all(12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _openAvatarPicker(BuildContext context) {
    final avatars = [
      {'key': 'ias_officer', 'emoji': '👮‍♂️', 'title': 'IAS Officer'},
      {'key': 'aspirant_male', 'emoji': '👨‍🎓', 'title': 'Aspirant (M)'},
      {'key': 'aspirant_female', 'emoji': '👩‍🎓', 'title': 'Aspirant (F)'},
      {'key': 'scholar', 'emoji': '🧑‍🏫', 'title': 'Scholar'},
      {'key': 'bookworm', 'emoji': '📚', 'title': 'Bookworm'},
      {'key': 'top_ranker', 'emoji': '🌟', 'title': 'Top Ranker'},
    ];

    showCupertinoModalPopup(
      context: context,
      builder: (ctx) {
        return CupertinoActionSheet(
          title: const Text('Choose Profile Avatar'),
          actions: avatars.map((a) {
            return CupertinoActionSheetAction(
              onPressed: () {
                profile.avatarKey = a['key']!;
                onProfileUpdate(profile);
                ApiService.syncProfile(profile);
                Navigator.pop(ctx);
              },
              child: Text('${a['emoji']}  ${a['title']}'),
            );
          }).toList(),
          cancelButton: CupertinoActionSheetAction(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
        );
      },
    );
  }

  void _showPolicySheet(BuildContext context, String title, String content) {
    showCupertinoModalPopup(
      context: context,
      builder: (ctx) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Material(
          color: Colors.transparent,
          child: Container(
            height: MediaQuery.of(context).size.height * 0.75,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            ),
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 17,
                        decoration: TextDecoration.none,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                    CupertinoButton(
                      padding: EdgeInsets.zero,
                      child: const Text('Done', style: TextStyle(fontWeight: FontWeight.w700)),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const Divider(height: 20),
                Expanded(
                  child: ListView(
                    physics: const BouncingScrollPhysics(),
                    children: [
                      Text(
                        content,
                        style: TextStyle(
                          fontSize: 14,
                          height: 1.55,
                          decoration: TextDecoration.none,
                          color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 140),
          children: [
            // iOS Title
            const Text(
              'Settings & Profile',
              style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, letterSpacing: -0.6),
            ),
            const SizedBox(height: 16),

            // Profile Card (Apple Apple-ID style)
            IosGlassCard(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => _openAvatarPicker(context),
                    child: CircleAvatar(
                      radius: 32,
                      backgroundColor: IosTheme.primaryBlue.withValues(alpha: 0.12),
                      child: Text(profile.avatarDisplayEmoji, style: const TextStyle(fontSize: 32)),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          profile.name,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          profile.email,
                          style: const TextStyle(fontSize: 12.5, color: CupertinoColors.systemGrey),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'UPSC CSE ${profile.attemptYear} • ${profile.optionalSubject}',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: IosTheme.primaryBlue,
                          ),
                        ),
                      ],
                    ),
                  ),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: () => _openEditProfileDialog(context),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: IosTheme.primaryBlue.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const FaIcon(FontAwesomeIcons.userPen, size: 16, color: IosTheme.primaryBlue),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Section 1: Notifications
            const Padding(
              padding: EdgeInsets.only(left: 4, bottom: 8),
              child: Text(
                'LIVE CLASSROOM NOTIFICATIONS',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: CupertinoColors.systemGrey, letterSpacing: 0.5),
              ),
            ),
            IosGlassCard(
              padding: EdgeInsets.zero,
              child: _buildToggleRow(
                icon: FontAwesomeIcons.bell,
                iconColor: IosTheme.systemOrange,
                title: '10-Minute Live Reminder',
                subtitle: 'Alert before your scheduled session begins',
                value: reminderEnabled,
                onChanged: onReminderToggle,
              ),
            ),
            const SizedBox(height: 24),

            // Section 2: Appearance
            const Padding(
              padding: EdgeInsets.only(left: 4, bottom: 8),
              child: Text(
                'APPEARANCE',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: CupertinoColors.systemGrey, letterSpacing: 0.5),
              ),
            ),
            IosGlassCard(
              padding: EdgeInsets.zero,
              child: _buildToggleRow(
                icon: FontAwesomeIcons.moon,
                iconColor: IosTheme.systemIndigo,
                title: 'Dark Mode',
                value: isDark,
                onChanged: (val) => onThemeToggle(),
              ),
            ),
            const SizedBox(height: 24),

            // Section 2: Policies & Academy Info
            const Padding(
              padding: EdgeInsets.only(left: 4, bottom: 8),
              child: Text(
                'ACADEMY INFORMATION & POLICIES',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: CupertinoColors.systemGrey, letterSpacing: 0.5),
              ),
            ),
            IosGlassCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  _buildSettingsTile(
                    icon: FontAwesomeIcons.globe,
                    color: const Color(0xFF10B981),
                    title: 'Course Admissions & Purchase Policy',
                    onTap: () => _showPolicySheet(
                      context,
                      'Admissions & Payment Policy',
                      'Official Course Purchase Policy:\n\nAll batch admissions, registrations, and official fee transactions are conducted exclusively through our verified web portal at https://indrajeetsir.com/#courses.\n\n• No In-App Payments: The mobile app is solely for attending live interactive classes, submitting answer sheets, and 1:1 mentorship chat.\n• Verified Invoicing: All fee receipts and GST invoices are generated upon web portal checkout.\n• Beware of fake UPI handles or unauthorized third-party representatives.',
                    ),
                  ),
                  Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                  _buildSettingsTile(
                    icon: FontAwesomeIcons.shieldHalved,
                    color: const Color(0xFF10B981),
                    title: 'Privacy & Data Protection',
                    onTap: () => _showPolicySheet(
                      context,
                      'Privacy Policy',
                      'Indrajeet Sir UPSC Mentorship Portal safeguards aspirant confidentiality.\n\nAll student performance evaluations, Mains answer scripts, and personal mentorship interactions are strictly confidential and encrypted under industry standard SSL/TLS protocols.\n\nWe do not share student contacts with third-party advertising partners.',
                    ),
                  ),
                  Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                  _buildSettingsTile(
                    icon: FontAwesomeIcons.fileContract,
                    color: const Color(0xFF6366F1),
                    title: 'Academic Code of Conduct',
                    onTap: () => _showPolicySheet(
                      context,
                      'Code of Conduct',
                      'Students enrolled under Indrajeet Sir\'s Mentorship agree to adhere to strict academic honesty, punctual attendance in personal strategy sessions, and respectful discourse across classroom interactions.\n\nClassroom video links and internal materials are licensed solely for the enrolled candidate.',
                    ),
                  ),
                  Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                  _buildSettingsTile(
                    icon: FontAwesomeIcons.circleInfo,
                    color: IosTheme.primaryBlue,
                    title: 'About Mentorship Program',
                    onTap: () => _showPolicySheet(
                      context,
                      'About Indrajeet Sir Academy',
                      'Founded by Indrajeet Sir, this program is dedicated to rigorous UPSC Civil Services & State PCS mentorship.\n\nFocused on analytical mastery, answer writing precision, and individual guidance tailored to each aspirant\'s strengths and weaknesses.\n\n• Email: indrajeet.visionias@gmail.com\n• Helpline: +91 98734 86158',
                    ),
                  ),
                  Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                  _buildSettingsTile(
                    icon: FontAwesomeIcons.headset,
                    color: const Color(0xFF10B981),
                    title: 'Contact & Support Desk',
                    onTap: () => _showPolicySheet(
                      context,
                      'Mentorship Support Desk',
                      'Direct Mentorship & Academic Inquiries:\n\n• Official Email: indrajeet.visionias@gmail.com\n• Call / WhatsApp: +91 98734 86158\n• Desk Availability: Mon–Sat, 9:00 AM – 8:00 PM IST\n\nFor session scheduling queries, evaluations, or test reviews, reach out directly to Sir\'s desk.',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Sign out
            IosGlassCard(
              padding: EdgeInsets.zero,
              child: CupertinoButton(
                padding: const EdgeInsets.symmetric(vertical: 14),
                child: const Center(
                  child: Text(
                    'Sign Out',
                    style: TextStyle(color: IosTheme.systemRed, fontWeight: FontWeight.w600, fontSize: 15),
                  ),
                ),
                onPressed: () async {
                  await SessionManager.clearSession();
                  if (context.mounted) {
                    Navigator.pushReplacement(
                      context,
                      CupertinoPageRoute(
                        builder: (ctx) => LoginScreen(
                          onThemeToggle: onThemeToggle,
                          profile: profile,
                          onProfileUpdate: onProfileUpdate,
                        ),
                      ),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildToggleRow({
    required FaIconData icon,
    required Color iconColor,
    required String title,
    String? subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          FaIcon(icon, color: iconColor, size: 20),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(title, style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w600)),
                if (subtitle != null && subtitle.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 11.5, color: CupertinoColors.systemGrey)),
                ],
              ],
            ),
          ),
          CupertinoSwitch(
            value: value,
            activeTrackColor: IosTheme.primaryBlue,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsTile({
    required FaIconData icon,
    required Color color,
    required String title,
    required VoidCallback onTap,
  }) {
    return CupertinoButton(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      onPressed: onTap,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(7),
            decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(8)),
            child: FaIcon(icon, size: 14, color: Colors.white),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w600),
            ),
          ),
          const FaIcon(FontAwesomeIcons.chevronRight, size: 12, color: CupertinoColors.systemGrey3),
        ],
      ),
    );
  }
}
