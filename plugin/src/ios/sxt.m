//
//  sxt.m
//  星河大数据
//
//  Created by 勒双双 on 16/7/11.
//
//

#import "sxt.h"

@implementation sxt
-(void) playYs7:(CDVInvokedUrlCommand *)command
{
    NSString *callBackId=command.callbackId;
    NSString *token=[command.arguments objectAtIndex:0] ;
    NSString *deviceId=[command.arguments objectAtIndex:1];
    
    CDVPluginResult  *result=nil;
    
    
    [self.commandDelegate sendPluginResult:result callbackId:callBackId];
    
    NSLog(@"callBackId is :%@,token is :%@,deviceId is :%@", callBackId,token,deviceId);

}
@end
