package com.sxt.cordova;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

public class sxt extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext)
    throws JSONException {
    //EZOpenSDK.initLib(this.getApplication(),"346249221d154bac9ba686873c2dffec","");

        Activity activity = this.cordova.getActivity();
        if (action.equals("playYs7")) {
            Intent i = activity.getIntent();
            Intent myIntent = new Intent(activity, PlayActivity.class);
            myIntent.putExtra("token", args.getString(0)); //Optional parameters
            myIntent.putExtra("cameraId", args.getString(1));
            activity.startActivity(myIntent);
            return true;
        }
        return false;
    }
}
