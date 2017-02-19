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
//  MainViewController.h
//  数字工程
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "MainViewController.h"

@implementation MainViewController

- (id)initWithNibName:(NSString*)nibNameOrNil bundle:(NSBundle*)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (void)viewDidLayoutSubviews{
    
    if ([self respondsToSelector:@selector(topLayoutGuide)]) // iOS 7 or above
    {
        [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];//当前黑色，如果要白色可以改成UIStatusBarStyleLightContent
        
        self.view.backgroundColor = [UIColor colorWithRed:233/ 255.0f green:48/ 255.0f blue:48/ 255.0f alpha:1];
        CGFloat top = self.topLayoutGuide.length;
        
        if(self.webView.frame.origin.y == 0){
            // We only want to do this once, or if the view has somehow been &quot;restored&quot; by other code.
            self.webView.frame = CGRectMake(self.webView.frame.origin.x, self.webView.frame.origin.y + top, self.webView.frame.size.width, self.webView.frame.size.height - top);
        }
    }
    
    UIScrollView *scroll=(UIScrollView *)[self.webView.subviews objectAtIndex:0];
    scroll.scrollEnabled=NO;
    
    
}

- (id)init
{
    self = [super init];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

#pragma mark View lifecycle

- (void)viewWillAppear:(BOOL)animated
{
    // View defaults to full size.  If you want to customize the view's size, or its subviews (e.g. webView),
    // you can do so here.

    [super viewWillAppear:animated];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

/* Comment out the block below to over-ride */

/*
- (UIWebView*) newCordovaViewWithFrame:(CGRect)bounds
{
    return[super newCordovaViewWithFrame:bounds];
}

- (NSUInteger)supportedInterfaceOrientations 
{
    return [super supportedInterfaceOrientations];
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation 
{
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

- (BOOL)shouldAutorotate 
{
    return [super shouldAutorotate];
}
*/

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    
    [self updateVersion];
    
    NSLog(@"---applicationDidBecomeActive----");
    //进入前台
    
    
}
//#pragma mark---判断版本号
-(void)updateVersion
{
    //  NSError *error;
    NSString *urlStr=[NSString stringWithFormat:@"%@",@"https://vkde.sxtsoft.com:4443/apps/manifest.plist"];
    
    //VersionPlistPath是你的Plist文件的位置，如http://xxx.xxx.xxx/xxx.plist
    NSDictionary* dict = [NSDictionary dictionaryWithContentsOfURL:[NSURL URLWithString:urlStr]];
    NSString *_latestVersion;
    if (dict) {
        
        NSArray* list = [dict objectForKey:@"items"];
        NSDictionary* dict2 = [list objectAtIndex:0];
        
        NSDictionary* dict3 = [dict2 objectForKey:@"metadata"];
        _latestVersion= [dict3 objectForKey:@"bundle-version"];
        
    }
    
    
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    
    // app名称
    NSString *app_Name = [infoDictionary objectForKey:@"CFBundleDisplayName"];
    // app版本
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    NSLog(@"app_Versionapp_Version%@",app_Version);
    
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


@end

@implementation MainCommandDelegate

/* To override the methods, uncomment the line in the init function(s)
   in MainViewController.m
 */

#pragma mark CDVCommandDelegate implementation

- (id)getCommandInstance:(NSString*)className
{
    return [super getCommandInstance:className];
}

- (NSString*)pathForResource:(NSString*)resourcepath
{
    return [super pathForResource:resourcepath];
}

@end

@implementation MainCommandQueue

/* To override, uncomment the line in the init function(s)
   in MainViewController.m
 */
- (BOOL)execute:(CDVInvokedUrlCommand*)command
{
    return [super execute:command];
}

@end
