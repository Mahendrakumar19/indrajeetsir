package com.nighwantech.indrajeetsir

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.ParcelFileDescriptor
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.ByteArrayOutputStream
import java.io.File

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.nighwantech.indrajeetsir/launcher"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "launchUrl" -> {
                    val url = call.argument<String>("url")
                    if (!url.isNullOrEmpty()) {
                        try {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            startActivity(intent)
                            result.success(true)
                        } catch (e: Exception) {
                            result.error("LAUNCH_ERROR", "Could not open URL: ${e.message}", null)
                        }
                    } else {
                        result.error("INVALID_URL", "Target URL was empty", null)
                    }
                }
                "getPdfPageCount" -> {
                    val path = call.argument<String>("path")
                    if (path != null) {
                        try {
                            val file = File(path)
                            if (!file.exists()) {
                                result.error("NOT_FOUND", "File does not exist: $path", null)
                                return@setMethodCallHandler
                            }
                            val pfd = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
                            val renderer = PdfRenderer(pfd)
                            val count = renderer.pageCount
                            renderer.close()
                            pfd.close()
                            result.success(count)
                        } catch (e: Exception) {
                            result.error("PDF_ERROR", e.message, null)
                        }
                    } else {
                        result.error("INVALID_PATH", "Path was null", null)
                    }
                }
                "renderPdfPage" -> {
                    val path = call.argument<String>("path")
                    val pageIndex = call.argument<Int>("pageIndex") ?: 0
                    val scale = call.argument<Double>("scale") ?: 2.0
                    if (path != null) {
                        try {
                            val file = File(path)
                            if (!file.exists()) {
                                result.error("NOT_FOUND", "File does not exist: $path", null)
                                return@setMethodCallHandler
                            }
                            val pfd = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
                            val renderer = PdfRenderer(pfd)
                            if (pageIndex in 0 until renderer.pageCount) {
                                val page = renderer.openPage(pageIndex)
                                val width = (page.width * scale).toInt().coerceAtLeast(100)
                                val height = (page.height * scale).toInt().coerceAtLeast(100)
                                val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                                bitmap.eraseColor(android.graphics.Color.WHITE)
                                page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                                page.close()
                                renderer.close()
                                pfd.close()

                                val stream = ByteArrayOutputStream()
                                bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream)
                                val byteArray = stream.toByteArray()
                                bitmap.recycle()
                                result.success(byteArray)
                            } else {
                                renderer.close()
                                pfd.close()
                                result.error("INVALID_PAGE", "Page index out of bounds", null)
                            }
                        } catch (e: Exception) {
                            result.error("PDF_ERROR", e.message, null)
                        }
                    } else {
                        result.error("INVALID_PATH", "Path was null", null)
                    }
                }
                else -> result.notImplemented()
            }
        }
    }
}
