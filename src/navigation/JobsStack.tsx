import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { JobDetailScreen } from '../screens/jobs/JobDetailScreen';
import { JobsScreen } from '../screens/jobs/JobsScreen';

export type JobsStackParams = {
  JobsList: undefined;
  JobDetail: { jobId: string };
};

const Stack = createNativeStackNavigator<JobsStackParams>();

export const JobsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JobsList">
      {({ navigation }) => (
        <JobsScreen
          onOpenJob={(jobId) => navigation.navigate('JobDetail', { jobId })}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="JobDetail">
      {({ navigation, route }) => (
        <JobDetailScreen
          jobId={route.params.jobId}
          onBack={() => navigation.goBack()}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);
