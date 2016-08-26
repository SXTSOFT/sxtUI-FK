/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  数字工程
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

#import <Cordova/CDVPlugin.h>

@implementation AppDelegate

{
    
    NSString *_latestVersion;
}
@synthesize window, viewController;
//下载app的url
#define AppUrl @"https://vkde.sxtsoft.com"




- (id)init
{
    /** If you need to do any extra app-specific initialization, you can do it here
     *  -jm
     **/
    NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];

    [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];

    int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
    int cacheSizeDisk = 32 * 1024 * 1024; // 32MB
#if __has_feature(objc_arc)
        NSURLCache* sharedCache = [[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"];
#else
        NSURLCache* sharedCache = [[[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"] autorelease];
#endif
    [NSURLCache setSharedURLCache:sharedCache];

    self = [super init];
    return self;
}

#pragma mark UIApplicationDelegate implementation

/**
 * This is main kick off after the app inits, the views and Settings are setup here. (preferred - iOS4 and up)
 */
- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    CGRect screenBounds = [[UIScreen mainScreen] bounds];

#if __has_feature(objc_arc)
        self.window = [[UIWindow alloc] initWithFrame:screenBounds];
#else
        self.window = [[[UIWindow alloc] initWithFrame:screenBounds] autorelease];
#endif
    self.window.autoresizesSubviews = YES;

#if __has_feature(objc_arc)
        self.viewController = [[MainViewController alloc] init];
#else
        self.viewController = [[[MainViewController alloc] init] autorelease];
#endif

    // Set your app's start page by setting the <content src='foo.html' /> tag in config.xml.
    // If necessary, uncomment the line below to override it.
    // self.viewController.startPage = @"index.html";

    // NOTE: To customize the view's frame size (which defaults to full screen), override
    // [self.viewController viewWillAppear:] in your view controller.

    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];

    return YES;
}
//程序变成激活状态----进入前台
- (void)applicationDidBecomeActive:(UIApplication *)application
{
    
    [self updateVersion];
    
    NSLog(@"---applicationDidBecomeActive----");
    //进入前台
    
    
}
#pragma mark---判断版本号
-(void)updateVersion
{
    //  NSError *error;
    NSString *urlStr=[NSString stringWithFormat:@"%@",@"https://vkde.sxtsoft.com:4443/apps/manifest.plist"];
    
    //VersionPlistPath是你的Plist文件的位置，如http://xxx.xxx.xxx/xxx.plist
    NSDictionary* dict = [NSDictionary dictionaryWithContentsOfURL:[NSURL URLWithString:urlStr]];
    
    if (dict) {
        
        NSArray* list = [dict objectForKey:@"items"];
        NSDictionary* dict2 = [list objectAtIndex:0];
        
        NSDictionary* dict3 = [dict2 objectForKey:@"metadata"];
        _latestVersion= [dict3 objectForKey:@"bundle-version"];
        
    }
    
    //        NSDictionary *infoDict = [[NSBundle mainBundle] infoDictionary];
    //        NSString *myVersion = [infoDict objectForKey:@"CFBundleShortVersionString"];
    //
    
    
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    
    // app名称
    NSString *app_Name = [infoDictionary objectForKey:@"CFBundleDisplayName"];
    // app版本
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    NSLog(@"app_Versionapp_Version%@",app_Version);
    // app build版本
    //    NSString *app_build = [infoDictionary objectForKey:@"CFBundleVersion"];
    //      NSLog(@"app_buildapp_build%@",app_build);
    //
    //    NSString *_currentVersion=[NSString stringWithFormat:@"%@.%@",app_Version,app_build];
    //
    //    NSLog(@"_currentVersion_currentVersion%@",_currentVersion);
    //
    // [HTTPManager requestLatestVersionWithBlock:^(NSDictionary *dict) {
    //  NSLog(@"dictdict%@",dict);
    
    
    //   _latestVersion=[appInfoDic objectForKey:@"version"];
    
    NSLog(@"_latestVersion%@",_latestVersion);
    
    //  NSLog(@"当前版本%@服务器上的版本%@",_currentVersion,_latestVersion);
    
    if ([_latestVersion isEqualToString:@"null"])
    {
       
        //当从plist获取的版本号为null时，则什么不做。
        
    }
    else{
    BOOL  isEuqal=[app_Version isEqualToString:_latestVersion];
    if (isEuqal)
    {
        //已经是最新版本  版本号为。。。。
        
        
    }
    
    else
        
    {
        //不是最新版本  提醒用户是否跟新
        NSString *title =[NSString stringWithFormat:@"检测更新：%@",app_Name];
        NSString *message = [NSString stringWithFormat:@"发现新版本(%@),是否升级",_latestVersion];
        NSString *cancelButtonTitle = NSLocalizedString(@"取消", nil);
        NSString *otherButtonTitle = NSLocalizedString(@"升级", nil);
        
        UIAlertView *alertView=[[UIAlertView alloc]initWithTitle:title message:message delegate:self cancelButtonTitle:cancelButtonTitle
                                               otherButtonTitles:otherButtonTitle,nil                  ];
        
        
        [alertView show];
        
        
        
        
        
    }
    
    }
    
    
    
}


- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    
    NSLog(@"buttonIndex%ld",(long)buttonIndex);
    if (buttonIndex==1)
    {
        
        
        [[UIApplication sharedApplication]openURL:[NSURL URLWithString:@"https://m.vanke.com/pcStore/detailsPhone/vkappcan10102_1"]];
        
        
    }
    
}
// this happens while we are running ( in the background, or from within our own app )
// only valid if 数字工程-Info.plist specifies a protocol to handle
- (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
{
    if (!url) {
        return NO;
    }

    // all plugins will get the notification, and their handlers will be called
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];

    return YES;
}

// repost all remote and local notification using the default NSNotificationCenter so multiple plugins may respond
- (void)            application:(UIApplication*)application
    didReceiveLocalNotification:(UILocalNotification*)notification
{
    // re-post ( broadcast )
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVLocalNotification object:notification];
}

#ifndef DISABLE_PUSH_NOTIFICATIONS

    - (void)                                 application:(UIApplication*)application
        didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
    {
        // re-post ( broadcast )
        NSString* token = [[[[deviceToken description]
            stringByReplacingOccurrencesOfString:@"<" withString:@""]
            stringByReplacingOccurrencesOfString:@">" withString:@""]
            stringByReplacingOccurrencesOfString:@" " withString:@""];

        [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotification object:token];
    }

    - (void)                                 application:(UIApplication*)application
        didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
    {
        // re-post ( broadcast )
        [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotificationError object:error];
    }
#endif

#if __IPHONE_OS_VERSION_MAX_ALLOWED < 90000
- (NSUInteger)application:(UIApplication*)application supportedInterfaceOrientationsForWindow:(UIWindow*)window
#else
- (UIInterfaceOrientationMask)application:(UIApplication*)application supportedInterfaceOrientationsForWindow:(UIWindow*)window
#endif
{
    // iPhone doesn't support upside down by default, while the iPad does.  Override to allow all orientations always, and let the root view controller decide what's allowed (the supported orientations mask gets intersected).
    NSUInteger supportedInterfaceOrientations = (1 << UIInterfaceOrientationPortrait) | (1 << UIInterfaceOrientationLandscapeLeft) | (1 << UIInterfaceOrientationLandscapeRight) | (1 << UIInterfaceOrientationPortraitUpsideDown);

    return supportedInterfaceOrientations;
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication*)application
{
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
}

@end
