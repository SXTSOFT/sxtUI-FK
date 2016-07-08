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
        Activity activity = this.cordova.getActivity();
        if (action.equals("playYs7")) {
            Intent i = activity.getIntent();
            if (i.hasExtra(Intent.EXTRA_TEXT)) {
                callbackContext.success(i.getStringExtra(Intent.EXTRA_TEXT));
            } else {
                callbackContext.error("");
            }
            return true;
        }
        return false;
    }
}
