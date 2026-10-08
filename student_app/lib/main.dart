import 'dart:async';
import 'dart:convert';
import 'dart:ui' as ui;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const EduApp());
}

// ============================================================================
// CENTRAL BACKEND SERVICE (Connects to Indrajeet Sir Mentorship Cloud API)
// ============================================================================
class ApiService {
  static const String baseUrl = 'https://backend.indrajeetsir.com';

  static Future<bool> checkHealth() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/')).timeout(const Duration(seconds: 5));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
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

  static Future<List<Map<String, String>>> fetchMessages() async {
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
              'sender': (m['studentName'] ?? m['sender'] ?? 'Indrajeet Sir').toString(),
              'text': (m['text'] ?? '').toString(),
              'time': (m['timestamp'] ?? 'Recently').toString(),
            };
          }).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  static Future<bool> sendMessage(String studentName, String text) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/messages'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'studentName': studentName,
          'text': text,
          'sender': 'student',
        }),
      ).timeout(const Duration(seconds: 7));

      return res.statusCode == 200 || res.statusCode == 201;
    } catch (_) {
      return false;
    }
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

  StudentProfile({
    required this.name,
    required this.email,
    required this.phone,
    required this.attemptYear,
    required this.optionalSubject,
    required this.bio,
    this.avatarKey = 'ias_officer',
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

  final StudentProfile _profile = StudentProfile(
    name: 'Rahul Kumar',
    email: 'rahul.kumar@indrajeetsir.com',
    phone: '+91 98765 43210',
    attemptYear: '2027',
    optionalSubject: 'Public Administration',
    bio: 'Targeting UPSC CSE 2027 • Mentored by Indrajeet Sir',
    avatarKey: 'ias_officer',
  );

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Indrajeet Sir IAS Mentorship',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: IosTheme.lightBg,
        primaryColor: IosTheme.primaryBlue,
        fontFamily: '.SF Pro Text',
        appBarTheme: const AppBarTheme(
          backgroundColor: IosTheme.lightBg,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: IconThemeData(color: Colors.black),
          titleTextStyle: TextStyle(
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
        fontFamily: '.SF Pro Text',
        appBarTheme: const AppBarTheme(
          backgroundColor: IosTheme.darkBg,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: IconThemeData(color: Colors.white),
          titleTextStyle: TextStyle(
            color: Colors.white,
            fontSize: 17,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.3,
          ),
        ),
      ),
      home: LoginScreen(
        onThemeToggle: _toggleTheme,
        profile: _profile,
        onProfileUpdate: (updated) => setState(() {}),
      ),
    );
  }
}

// ============================================================================
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
  final _emailController = TextEditingController(text: 'rahul.kumar@indrajeetsir.com');
  final _passwordController = TextEditingController(text: '123456');
  bool _isLoading = false;

  Future<void> _login() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    setState(() => _isLoading = true);
    final data = await ApiService.studentLogin(email, password);

    if (mounted) {
      if (data != null && data['student'] != null) {
        final st = data['student'];
        widget.profile.name = st['name'] ?? widget.profile.name;
        widget.profile.email = st['email'] ?? widget.profile.email;
        widget.profile.phone = st['phone'] ?? widget.profile.phone;
        widget.profile.attemptYear = st['attempt'] ?? widget.profile.attemptYear;
        if (st['bio'] != null && (st['bio'] as String).isNotEmpty) {
          widget.profile.bio = st['bio'];
        }
        if (st['optionalSubject'] != null && (st['optionalSubject'] as String).isNotEmpty) {
          widget.profile.optionalSubject = st['optionalSubject'];
        }
        if (st['avatarKey'] != null && (st['avatarKey'] as String).isNotEmpty) {
          widget.profile.avatarKey = st['avatarKey'];
        }
        widget.onProfileUpdate(widget.profile);
      }

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
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Academy Emblem
                Container(
                  width: 84,
                  height: 84,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(CupertinoIcons.book_fill, size: 40, color: Colors.white),
                  ),
                ),
                const SizedBox(height: 24),

                const Text(
                  'Indrajeet Sir IAS',
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
                    fontSize: 14,
                    color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 36),

                // iOS Inset Grouped Credentials Box
                IosGlassCard(
                  padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
                  borderRadius: 18,
                  child: Column(
                    children: [
                      CupertinoTextField(
                        controller: _emailController,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        placeholder: 'Student Email or Roll Number',
                        prefix: const Padding(
                          padding: EdgeInsets.only(right: 8),
                          child: Icon(CupertinoIcons.mail, size: 18, color: CupertinoColors.systemGrey),
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
                          padding: EdgeInsets.only(right: 8),
                          child: Icon(CupertinoIcons.lock, size: 18, color: CupertinoColors.systemGrey),
                        ),
                        decoration: const BoxDecoration(),
                        style: TextStyle(color: isDark ? Colors.white : Colors.black),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Apple Primary Continue Button
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: CupertinoButton.filled(
                    borderRadius: BorderRadius.circular(16),
                    onPressed: _isLoading ? null : _login,
                    child: _isLoading
                        ? const CupertinoActivityIndicator(color: Colors.white)
                        : const Text(
                            'Sign In to Mentorship',
                            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                          ),
                  ),
                ),
                const SizedBox(height: 20),

                // Help line
                Text(
                  'Authorized enrolled aspirants only',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? CupertinoColors.tertiaryLabel.darkColor : CupertinoColors.tertiaryLabel.color,
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

      // Class is starting within 10 minutes
      if (diffInMinutes >= 0 && diffInMinutes <= 10) {
        if (mounted) {
          setState(() {
            _upcomingAlertClass = cls;
            _minutesRemaining = diffInMinutes == 0 ? 1 : diffInMinutes;
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
      'title': '1:1 GS-3 Strategy Session',
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
                        cls['title'] ?? '1:1 Mentorship Session',
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
        ],
      ),

      // ── ULTRA REFINED iOS FROSTED FLOATING TAB DOCK ──
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
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
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildDockItem(0, CupertinoIcons.house_fill, 'Overview'),
                    _buildDockItem(1, CupertinoIcons.tv_fill, 'Classroom'),
                    _buildDockItem(2, CupertinoIcons.chat_bubble_2_fill, 'Mentorship'),
                    _buildDockItem(3, CupertinoIcons.person_crop_circle_fill, 'Settings'),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDockItem(int index, IconData icon, String label) {
    final isSelected = _selectedIndex == index;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final activeColor = IosTheme.primaryBlue;
    final inactiveColor = isDark ? CupertinoColors.systemGrey : CupertinoColors.systemGrey2;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => setState(() => _selectedIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark ? activeColor.withValues(alpha: 0.18) : activeColor.withValues(alpha: 0.10))
              : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 22,
              color: isSelected ? activeColor : inactiveColor,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? activeColor : inactiveColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// 3. HOME SCREEN (OVERVIEW) — CLEAN iOS HIG DESIGN
// ============================================================================
class HomeScreen extends StatelessWidget {
  final StudentProfile profile;
  final Map<String, dynamic>? upcomingClass;
  final int minutesRemaining;
  final Function(int) onNavigateTab;

  const HomeScreen({
    super.key,
    required this.profile,
    this.upcomingClass,
    this.minutesRemaining = 10,
    required this.onNavigateTab,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // iOS Large Title Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'UPSC CSE ${profile.attemptYear.toUpperCase()}',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.8,
                            color: IosTheme.primaryBlue,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Welcome, ${profile.name.split(' ')[0]}',
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.6,
                          ),
                        ),
                      ],
                    ),
                    GestureDetector(
                      onTap: () => onNavigateTab(3),
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: IosTheme.primaryBlue, width: 2),
                        ),
                        child: CircleAvatar(
                          radius: 20,
                          backgroundColor: IosTheme.primaryBlue.withValues(alpha: 0.12),
                          child: Text(profile.avatarDisplayEmoji, style: const TextStyle(fontSize: 20)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Content List
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // Upcoming Live Session Hero
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
                                color: IosTheme.primaryBlue,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Row(
                                children: [
                                  Icon(CupertinoIcons.circle_fill, size: 8, color: Colors.white),
                                  SizedBox(width: 5),
                                  Text(
                                    'UPCOMING SESSION',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Text(
                              'Tonight • 7:00 PM',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: CupertinoColors.systemGrey),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        const Text(
                          'GS Paper 3: Economic Strategy & Budgeting',
                          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, letterSpacing: -0.3),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '1:1 Session with Indrajeet Sir • Mentorship Review',
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
                                onPressed: () => onNavigateTab(1),
                                child: const Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(CupertinoIcons.videocam_fill, size: 16, color: Colors.white),
                                    SizedBox(width: 6),
                                    Text('Open Classroom', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: Colors.white)),
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

                  // Section Title: Daily Focus
                  const Padding(
                    padding: EdgeInsets.only(left: 4, bottom: 10),
                    child: Text(
                      'DAILY TARGETS',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                        color: CupertinoColors.systemGrey,
                      ),
                    ),
                  ),

                  // Three Activity Stat Cards (Apple Health Style)
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricTile(
                          context,
                          title: 'Mains Practice',
                          value: '2 of 2',
                          subtitle: 'Submitted',
                          icon: CupertinoIcons.doc_text_fill,
                          color: IosTheme.systemGreen,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildMetricTile(
                          context,
                          title: 'Live Watch',
                          value: '2.5 hrs',
                          subtitle: 'Today',
                          icon: CupertinoIcons.time_solid,
                          color: IosTheme.primaryBlue,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildMetricTile(
                          context,
                          title: 'Syllabus',
                          value: '74%',
                          subtitle: 'GS Complete',
                          icon: CupertinoIcons.chart_pie_fill,
                          color: IosTheme.systemIndigo,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Section Title: Mentor's Note
                  const Padding(
                    padding: EdgeInsets.only(left: 4, bottom: 10),
                    child: Text(
                      'MENTOR DIRECTIVE',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                        color: CupertinoColors.systemGrey,
                      ),
                    ),
                  ),

                  IosGlassCard(
                    padding: const EdgeInsets.all(18),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: IosTheme.systemOrange.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(CupertinoIcons.quote_bubble_fill, color: IosTheme.systemOrange, size: 22),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Indrajeet Sir\'s Daily Advice',
                                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '"Focus on crisp structure and contextual examples in GS Paper 3 today. Revise previous year questions before joining tonight\'s review."',
                                style: TextStyle(
                                  fontSize: 13,
                                  height: 1.45,
                                  color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Core Modules List (iOS Inset Grouped)
                  const Padding(
                    padding: EdgeInsets.only(left: 4, bottom: 10),
                    child: Text(
                      'STUDY MODULES',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                        color: CupertinoColors.systemGrey,
                      ),
                    ),
                  ),

                  IosGlassCard(
                    padding: EdgeInsets.zero,
                    child: Column(
                      children: [
                        _buildSettingsRow(
                          context,
                          icon: CupertinoIcons.globe,
                          iconColor: const Color(0xFF0284C7),
                          title: 'Current Affairs & Editorials',
                          subtitle: 'Daily curated analysis',
                          onTap: () {},
                        ),
                        Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                        _buildSettingsRow(
                          context,
                          icon: CupertinoIcons.pencil_ellipsis_rectangle,
                          iconColor: const Color(0xFF7C3AED),
                          title: 'Mains Answer Evaluation',
                          subtitle: 'Indrajeet Sir checked copies',
                          onTap: () {},
                        ),
                        Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                        _buildSettingsRow(
                          context,
                          icon: CupertinoIcons.book_fill,
                          iconColor: const Color(0xFF059669),
                          title: 'GS Optional Archives',
                          subtitle: profile.optionalSubject,
                          onTap: () {},
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
    );
  }

  Widget _buildMetricTile(
    BuildContext context, {
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color color,
  }) {
    return IosGlassCard(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(height: 10),
          Text(
            value,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, letterSpacing: -0.4),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: CupertinoColors.systemGrey),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsRow(
    BuildContext context, {
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return CupertinoButton(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      onPressed: onTap,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(7),
            decoration: BoxDecoration(
              color: iconColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 18, color: Colors.white),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).brightness == Brightness.dark ? Colors.white : Colors.black,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 11.5, color: CupertinoColors.systemGrey),
                ),
              ],
            ),
          ),
          const Icon(CupertinoIcons.chevron_right, size: 14, color: CupertinoColors.systemGrey3),
        ],
      ),
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
  int _selectedSegment = 0; // 0: Allotted, 1: Masterclasses
  bool _isLoading = false;
  List<Map<String, dynamic>> _classes = [];

  @override
  void initState() {
    super.initState();
    _loadClasses();
  }

  Future<void> _loadClasses() async {
    setState(() => _isLoading = true);
    final remote = await ApiService.fetchLiveClasses();
    if (mounted) {
      setState(() {
        _classes = remote;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final defaultClasses = [
      {
        'title': '1:1 GS-3 Strategy Review Session',
        'instructor': 'Indrajeet Sir',
        'date': 'Today',
        'time': '7:00 PM',
        'assignedStudent': widget.profile.name,
        'meetLink': 'https://meet.google.com/abc-defg-hij',
        'status': 'SCHEDULED',
      },
      {
        'title': 'Mains Answer Writing Structure Masterclass',
        'instructor': 'Indrajeet Sir',
        'date': 'Tomorrow',
        'time': '6:30 PM',
        'assignedStudent': 'All Students',
        'meetLink': 'https://meet.google.com/xyz-uvw-rst',
        'status': 'SCHEDULED',
      },
      {
        'title': 'Ethics & Integrity Case Study Workshop',
        'instructor': 'Indrajeet Sir',
        'date': 'Saturday',
        'time': '5:00 PM',
        'assignedStudent': 'All Students',
        'meetLink': 'https://meet.google.com/klm-nop-qrs',
        'status': 'UPCOMING',
      },
    ];

    final displayList = _classes.isNotEmpty ? _classes : defaultClasses;

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
                    'Live Classroom',
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, letterSpacing: -0.6),
                  ),
                  CupertinoButton(
                    padding: EdgeInsets.zero,
                    onPressed: _loadClasses,
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
                      child: Text('Allotted (1:1)', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                    1: Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: Text('All Masterclasses', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                  },
                  onValueChanged: (val) {
                    if (val != null) setState(() => _selectedSegment = val);
                  },
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Class List
            Expanded(
              child: _isLoading
                  ? const Center(child: CupertinoActivityIndicator())
                  : ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
                      itemCount: displayList.length,
                      itemBuilder: (context, index) {
                        final cls = displayList[index];
                        final isAllottedToStudent = (cls['assignedStudent'] ?? '').toString().toLowerCase().contains(widget.profile.name.toLowerCase()) ||
                            cls['assignedStudent'] == 'Rahul Kumar';

                        if (_selectedSegment == 0 && !isAllottedToStudent && cls['assignedStudent'] != 'All Students') {
                          return const SizedBox.shrink();
                        }

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
                                      isAllottedToStudent ? '1:1 ALLOTTED MENTEE' : 'BATCH MASTERCLASS',
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
class ChatScreen extends StatefulWidget {
  final StudentProfile profile;

  const ChatScreen({super.key, required this.profile});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _msgController = TextEditingController();
  final List<Map<String, String>> _messages = [
    {
      'sender': 'Indrajeet Sir',
      'text': 'Good morning Rahul. Did you finish the Case Study outline for Ethics Paper 4?',
      'time': '10:00 AM',
    },
    {
      'sender': 'Rahul Kumar',
      'text': 'Yes sir, submitted my response sheet on the portal. Ready for your review.',
      'time': '10:05 AM',
    },
    {
      'sender': 'Indrajeet Sir',
      'text': 'Excellent. We will evaluate your answer during tonight\'s 1:1 live strategy call at 7:00 PM.',
      'time': '10:12 AM',
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
      setState(() => _messages.addAll(remote));
    }
  }

  Future<void> _send() async {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({
        'sender': widget.profile.name,
        'text': text,
        'time': 'Just now',
      });
      _msgController.clear();
    });

    await ApiService.sendMessage(widget.profile.name, text);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // iOS Chat Nav Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: IosTheme.primaryBlue,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text('IS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
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
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final msg = _messages[index];
                  final isMe = msg['sender'] == widget.profile.name || msg['sender'] == 'Rahul Kumar';

                  return Align(
                    alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
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
                          Text(
                            msg['text']!,
                            style: TextStyle(
                              color: isMe ? Colors.white : (isDark ? Colors.white : Colors.black),
                              fontSize: 14.5,
                              height: 1.35,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            msg['time']!,
                            style: TextStyle(
                              color: isMe ? Colors.white70 : CupertinoColors.systemGrey,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // iOS Frosted Input Bar
            Container(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1C1C1E) : Colors.white,
                border: Border(top: BorderSide(color: IosTheme.separator(isDark))),
              ),
              child: Row(
                children: [
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
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: IosTheme.primaryBlue,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(CupertinoIcons.arrow_up, size: 18, color: Colors.white),
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
        return Padding(
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
                    const Text('Edit Profile', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
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
                        prefix: const Padding(padding: EdgeInsets.only(left: 8), child: Icon(CupertinoIcons.person, size: 18)),
                        padding: const EdgeInsets.all(12),
                      ),
                      const SizedBox(height: 12),
                      CupertinoTextField(
                        controller: emailCtrl,
                        placeholder: 'Email',
                        prefix: const Padding(padding: EdgeInsets.only(left: 8), child: Icon(CupertinoIcons.mail, size: 18)),
                        padding: const EdgeInsets.all(12),
                      ),
                      const SizedBox(height: 12),
                      CupertinoTextField(
                        controller: phoneCtrl,
                        placeholder: 'Phone / WhatsApp',
                        prefix: const Padding(padding: EdgeInsets.only(left: 8), child: Icon(CupertinoIcons.phone, size: 18)),
                        padding: const EdgeInsets.all(12),
                      ),
                      const SizedBox(height: 12),
                      CupertinoTextField(
                        controller: optionalCtrl,
                        placeholder: 'Optional Subject',
                        prefix: const Padding(padding: EdgeInsets.only(left: 8), child: Icon(CupertinoIcons.book, size: 18)),
                        padding: const EdgeInsets.all(12),
                      ),
                      const SizedBox(height: 12),
                      CupertinoTextField(
                        controller: bioCtrl,
                        placeholder: 'Personal Directive / Bio',
                        maxLines: 2,
                        padding: const EdgeInsets.all(12),
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
        return Container(
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
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 17)),
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
                        color: isDark ? CupertinoColors.secondaryLabel.darkColor : CupertinoColors.secondaryLabel.color,
                      ),
                    ),
                  ],
                ),
              ),
            ],
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
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
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
                    child: const Icon(CupertinoIcons.pencil_circle_fill, size: 28, color: IosTheme.primaryBlue),
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
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(CupertinoIcons.alarm_fill, color: IosTheme.systemOrange),
                    title: const Text('10-Min Live Reminder', style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w600)),
                    subtitle: const Text('Alert before your allotted session begins', style: TextStyle(fontSize: 11.5, color: CupertinoColors.systemGrey)),
                    trailing: CupertinoSwitch(
                      value: reminderEnabled,
                      activeTrackColor: IosTheme.primaryBlue,
                      onChanged: onReminderToggle,
                    ),
                  ),
                  Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                  ListTile(
                    leading: const Icon(CupertinoIcons.moon_fill, color: IosTheme.systemIndigo),
                    title: const Text('iOS Dark Mode', style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w600)),
                    subtitle: const Text('Deep OLED black appearance', style: TextStyle(fontSize: 11.5, color: CupertinoColors.systemGrey)),
                    trailing: CupertinoSwitch(
                      value: isDark,
                      activeTrackColor: IosTheme.primaryBlue,
                      onChanged: (val) => onThemeToggle(),
                    ),
                  ),
                ],
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
                    icon: CupertinoIcons.shield_fill,
                    color: const Color(0xFF10B981),
                    title: 'Privacy & Data Protection',
                    onTap: () => _showPolicySheet(
                      context,
                      'Privacy Policy',
                      'Indrajeet Sir IAS Mentorship Portal safeguards aspirant confidentiality.\n\nAll student performance evaluations, Mains answer scripts, and personal mentorship interactions are strictly confidential and encrypted under industry standard SSL/TLS protocols.\n\nWe do not share student contacts with third-party advertising partners.',
                    ),
                  ),
                  Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                  _buildSettingsTile(
                    icon: CupertinoIcons.doc_plaintext,
                    color: const Color(0xFF6366F1),
                    title: 'Academic Code of Conduct',
                    onTap: () => _showPolicySheet(
                      context,
                      'Code of Conduct',
                      'Students enrolled under Indrajeet Sir\'s Mentorship agree to adhere to strict academic honesty, punctual attendance in 1:1 sessions, and respectful discourse across classroom interactions.\n\nClassroom video links and internal materials are licensed solely for the enrolled candidate.',
                    ),
                  ),
                  Divider(height: 1, indent: 56, color: IosTheme.separator(isDark)),
                  _buildSettingsTile(
                    icon: CupertinoIcons.info_circle_fill,
                    color: IosTheme.primaryBlue,
                    title: 'About Mentorship Program',
                    onTap: () => _showPolicySheet(
                      context,
                      'About Indrajeet Sir Academy',
                      'Founded by Indrajeet Sir, this program is dedicated to rigorous UPSC Civil Services & State PCS mentorship.\n\nFocused on analytical mastery, answer writing precision, and individual guidance tailored to each aspirant\'s strengths and weaknesses.',
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
                onPressed: () {
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
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required Color color,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(8)),
        child: Icon(icon, size: 16, color: Colors.white),
      ),
      title: Text(title, style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w600)),
      trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: CupertinoColors.systemGrey3),
      onTap: onTap,
    );
  }
}
