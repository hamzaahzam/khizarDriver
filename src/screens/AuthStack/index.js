import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './SignIn';
import VerificationCode from './VerificationCode';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';

const Stack = createStackNavigator();
export default AuthStack = () => (
    <Stack.Navigator  initialRouteName='SignIn' headerMode="none">
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Verification" component={VerificationCode} options={{
            title: 'Verification',
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: { alignSelf: 'center', color: 'white', marginRight: 10, fontWeight: 'bold', fontSize: 25 },
            headerTintColor: 'white',
            headerBackTitle:''

          }}/>
           <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{
            title: 'Forget Password',
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: { alignSelf: 'center', color: 'white', marginRight: 10, fontWeight: 'bold', fontSize: 25 },
            headerTintColor: 'white',
            headerBackTitle:''
          }} />
 <Stack.Screen name="ResetPassword" component={ResetPassword} options={{
            title: 'Reset Password',
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: { alignSelf: 'center', color: 'white', marginRight: 10, fontWeight: 'bold', fontSize: 25 },
            headerTintColor: 'white',
            headerBackTitle:''
          }} />
    </Stack.Navigator>
);