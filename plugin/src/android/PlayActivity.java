package com.sxt.cordova;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.AnimationDrawable;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnKeyListener;
import android.view.View.OnTouchListener;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.ViewTreeObserver.OnGlobalLayoutListener;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.view.animation.TranslateAnimation;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.HorizontalScrollView;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.PopupWindow.OnDismissListener;
import android.widget.RelativeLayout;
import android.widget.RelativeLayout.LayoutParams;
import android.widget.TextView;
import android.widget.Toast;
import com.sxt.vanke.R;
import com.hik.streamconvert.StreamConvert;
import com.hik.streamconvert.StreamConvertCB;
import com.videogo.constant.Config;
import com.videogo.constant.Constant;
import com.videogo.constant.IntentConsts;
import com.videogo.exception.BaseException;
import com.videogo.exception.CASClientSDKException;
import com.videogo.exception.ErrorCode;
import com.videogo.exception.HCNetSDKException;
import com.videogo.exception.InnerException;
import com.videogo.exception.RtspClientException;
import com.videogo.exception.TTSClientSDKException;
import com.videogo.openapi.EZConstants;
import com.videogo.openapi.EZConstants.EZPTZAction;
import com.videogo.openapi.EZConstants.EZPTZCommand;
import com.videogo.openapi.EZConstants.EZRealPlayConstants;
import com.videogo.openapi.EZConstants.EZVideoLevel;
import com.videogo.openapi.EZOpenSDK;
import com.videogo.openapi.EZPlayer;
import com.videogo.openapi.bean.EZCameraInfo;
import com.videogo.openapi.bean.EZDeviceInfo;
import com.videogo.realplay.RealPlayStatus;
import com.videogo.util.ConnectionDetector;
import com.videogo.util.LocalInfo;
import com.videogo.util.LogUtil;
import com.videogo.util.MediaScanner;
import com.videogo.util.RotateViewUtil;
import com.videogo.util.SDCardUtil;
import com.videogo.util.Utils;
import com.videogo.widget.CheckTextButton;
import com.videogo.widget.CustomRect;
import com.videogo.widget.CustomTouchListener;
import com.videogo.widget.RingView;
import com.videogo.widget.TitleBar;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;


public class PlayActivity extends Activity implements OnClickListener, SurfaceHolder.Callback,
        Handler.Callback {

    private static final String TAG = "PlayActivity";

    private EZPlayer mEZPlayer = null;
    private SurfaceView mRealPlaySv = null;
    private SurfaceHolder mRealPlaySh = null;
    private EZOpenSDK mEZOpenSDK = EZOpenSDK.getInstance();
    private Handler mHandler = null;
    private String cameraId = null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        super.onCreate(savedInstanceState);

        mHandler = new Handler(this);


        setContentView(R.layout.activity_play);
        mRealPlaySv = (SurfaceView) findViewById(R.id.realplay_sv);
        mRealPlaySv.getHolder().addCallback(this);

        //mEZOpenSDK.initLib()
        Intent intent = getIntent();
        String token = intent.getStringExtra("token");
        cameraId =intent.getStringExtra("cameraId");
        mEZOpenSDK = EZOpenSDK.getInstance();
        mEZOpenSDK.setAccessToken(token);
        startRealPlay();

    }

    @Override
    protected void onResume() {
        super.onResume();

        new Handler().postDelayed(new Runnable() {

            @Override
            public void run() {
                if (mRealPlaySv != null) {
                    startRealPlay();
                }
            }
        }, 200);
    }

    @Override
    protected void onPause(){
        super.onPause();
        stopRealPlay();
    }

    @Override
    protected void onStop(){
        super.onStop();
        stopRealPlay();
    }


    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
    }



    @Override
    public void onClick(View view) {
        /*switch (view.getId()) {
            case R.id.realplay_play_btn:
            case R.id.realplay_full_play_btn:
            case R.id.realplay_play_iv:
                if (mStatus != RealPlayStatus.STATUS_STOP) {
                    stopRealPlay();
                    setRealPlayStopUI();
                } else {
                    startRealPlay();
                }
                break;
            case R.id.realplay_previously_btn:
            case R.id.realplay_previously_btn2:
            case R.id.realplay_full_previously_btn:
                onCapturePicBtnClick();
                break;
            case R.id.realplay_capture_rl:
                onCaptureRlClick();
                break;
            case R.id.realplay_video_btn:
            case R.id.realplay_video_start_btn:
            case R.id.realplay_video_btn2:
            case R.id.realplay_video_start_btn2:
            case R.id.realplay_full_video_btn:
            case R.id.realplay_full_video_start_btn:
                onRecordBtnClick();
                break;
            case R.id.realplay_talk_btn:
            case R.id.realplay_talk_btn2:
            case R.id.realplay_full_talk_btn:
                startVoiceTalk();
                break;

            case R.id.realplay_quality_btn:
                openQualityPopupWindow(mRealPlayQualityBtn);
                break;
            case R.id.realplay_ptz_btn:
            case R.id.realplay_ptz_btn2:
                openPtzPopupWindow(mRealPlayPageLy);
                break;
            case R.id.realplay_full_ptz_btn:
                setFullPtzStartUI(true);
                break;
            case R.id.realplay_full_ptz_anim_btn:
                setFullPtzStopUI(true);
                break;
            case R.id.realplay_sound_btn:
            case R.id.realplay_full_sound_btn:
                onSoundBtnClick();
                break;
            case R.id.realplay_full_talk_anim_btn:
                closeTalkPopupWindow(true, true);
                break;
            default:
                break;
        }*/
    }

    private void startRealPlay() {
            Runnable run = new Runnable() {
                @Override
                public void run() {
                    mEZPlayer = mEZOpenSDK.createPlayer(PlayActivity.this, cameraId);

                    if (mEZPlayer == null)
                        return;
                    mEZPlayer.setHandler(mHandler);
                    mEZPlayer.setSurfaceHold(mRealPlaySh);

                    mEZPlayer.startRealPlay();
                }
            };
            Thread thr = new Thread(run);
            thr.start();

    }

    private void stopRealPlay() {
        if (mEZPlayer != null) {
            mEZPlayer.stopRealPlay();
        }
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        if (mEZPlayer != null) {
            mEZPlayer.setSurfaceHold(holder);
        }
        mRealPlaySh = holder;
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        if (mEZPlayer != null) {
            mEZPlayer.setSurfaceHold(null);
        }
        mRealPlaySh = null;
    }



    @SuppressLint("NewApi")
    @Override
    public boolean handleMessage(Message msg) {
        // LogUtil.infoLog(TAG, "handleMessage:" + msg.what);
        if (this.isFinishing()) {
            return false;
        }
 /*       switch (msg.what) {
            case EZRealPlayConstants.MSG_GET_CAMERA_INFO_SUCCESS:
*//*                updateLoadingProgress(20);
                handleGetCameraInfoSuccess();*//*
                break;
            case EZRealPlayConstants.MSG_REALPLAY_PLAY_START:
                //updateLoadingProgress(40);
                break;
            case EZRealPlayConstants.MSG_REALPLAY_CONNECTION_START:
               // updateLoadingProgress(60);
                break;
            case EZRealPlayConstants.MSG_REALPLAY_CONNECTION_SUCCESS:
               // updateLoadingProgress(80);
                break;
            case EZRealPlayConstants.MSG_REALPLAY_PLAY_SUCCESS:
                //handlePlaySuccess(msg);
                break;
            case EZRealPlayConstants.MSG_REALPLAY_PLAY_FAIL:
                //handlePlayFail(msg.arg1, msg.arg2);
                break;
*//*            case EZRealPlayConstants.MSG_REALPLAY_PASSWORD_ERROR:
                if (mCameraInfo != null && mCameraInfo.getShareStatus() == 1) {
                    showSharePasswordError();
                } else {
                    handlePasswordError(R.string.realplay_password_error_title,
                            R.string.realplay_password_error_message3, R.string.realplay_password_error_message1);
                }*//*
                break;
            case EZRealPlayConstants.MSG_REALPLAY_ENCRYPT_PASSWORD_ERROR:
                *//*if (mCameraInfo != null && mCameraInfo.getShareStatus() == 1) {
                    showSharePasswordError();
                } else {

                    handlePasswordError(R.string.realplay_encrypt_password_error_title,
                            R.string.realplay_encrypt_password_error_message, 0);
                }*//*
                break;
            case EZRealPlayConstants.MSG_SET_VEDIOMODE_SUCCESS:
                //handleSetVedioModeSuccess();
                break;
            case EZRealPlayConstants.MSG_SET_VEDIOMODE_FAIL:
                //handleSetVedioModeFail(msg.arg1);
                break;
            case EZRealPlayConstants.MSG_PTZ_SET_FAIL:
                //handlePtzControlFail(msg);
                break;
            case EZRealPlayConstants.MSG_START_RECORD_SUCCESS:
               // handleRecordSuccess((String) msg.obj);
                break;
            case EZRealPlayConstants.MSG_START_RECORD_FAIL:
                //handleRecordFail(msg.arg1);
                break;
            case EZRealPlayConstants.MSG_REALPLAY_VOICETALK_SUCCESS:
                //handleVoiceTalkSucceed();
                break;
            case EZRealPlayConstants.MSG_REALPLAY_VOICETALK_STOP:
                //handleVoiceTalkStoped(false);
                break;
            case EZRealPlayConstants.MSG_REALPLAY_VOICETALK_FAIL:
                //handleVoiceTalkFailed(msg.arg1, (String) msg.obj, msg.arg2);
                break;
            case MSG_PLAY_UI_UPDATE:
                updateRealPlayUI();
                break;
            case MSG_AUTO_START_PLAY:
                startRealPlay();
                break;
            case MSG_CLOSE_PTZ_PROMPT:
                mRealPlayFullPtzPromptIv.setVisibility(View.GONE);
                break;
            case MSG_HIDE_PTZ_DIRECTION:
                handleHidePtzDirection(msg);
                break;
            case MSG_HIDE_PAGE_ANIM:
                hidePageAnim();
                break;
            case MSG_PLAY_UI_REFRESH:
                initUI();
                break;
            case MSG_PREVIEW_START_PLAY:
                mPageAnimIv.setVisibility(View.GONE);
                mRealPlayPreviewTv.setVisibility(View.GONE);
                mStatus = RealPlayStatus.STATUS_INIT;
                startRealPlay();
                break;
            default:
                break;
        }*/
        return false;
    }
}
