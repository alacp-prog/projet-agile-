import React, { useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ConnectScreen() {
  const [activeTab, setActiveTab] = useState('MyCard');

  return (
    <SafeAreaView className="flex-1 bg-[#ede9fe]" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ede9fe" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-[#ede9fe]">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-xl font-bold text-indigo-600">Connect</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="settings-sharp" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Main purple background area */}
      <View className="flex-1 bg-[#6d28d9] px-4 pt-6 pb-20">

        {/* The Card */}
        <View className="flex-1 bg-white rounded-[32px] overflow-hidden shadow-sm">

          {/* Top section (white) */}
          <View className="px-6 pt-8 pb-6 flex-1 items-center">

            {/* Avatar Profile */}
            <View className="w-28 h-28 rounded-full border-[3px] border-indigo-600 p-1 mb-4 shadow-sm bg-white">
              <View className="flex-1 rounded-full overflow-hidden">
                <Image
                  source={{ uri: 'https://i.pravatar.cc/300?img=11' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>

            <Text className="text-2xl font-extrabold text-slate-900 mb-1">Alex Rivera</Text>
            <Text className="text-[15px] text-slate-500 mb-6">Senior Product Designer</Text>

            {/* Action Buttons Row */}
            <View className="flex-row items-center justify-center gap-4 mb-8 w-full">
              <TouchableOpacity className="w-12 h-12 bg-[#f1f5f9] rounded-2xl items-center justify-center">
                <Feather name="code" size={20} color="#475569" />
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 bg-[#e2e8f0] rounded-2xl items-center justify-center shadow-sm">
                <Feather name="briefcase" size={20} color="#334155" />
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 bg-[#f1f5f9] rounded-2xl items-center justify-center">
                <Feather name="share-2" size={20} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* Contact Details List */}
            <View className="w-full mb-6">

              {/* Phone */}
              <View className="flex-row items-center bg-[#f5f3ff] rounded-2xl p-4 mb-3">
                <View className="w-10 h-10 bg-[#ede9fe] rounded-full items-center justify-center mr-4">
                  <Ionicons name="call" size={18} color="#4f46e5" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-500 tracking-wider mb-0.5">PHONE</Text>
                  <Text className="text-[14px] font-semibold text-slate-900">+1 (555) 0123-4567</Text>
                </View>
                <TouchableOpacity className="p-2">
                  <Ionicons name="copy-outline" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Email */}
              <View className="flex-row items-center bg-[#f5f3ff] rounded-2xl p-4 mb-3">
                <View className="w-10 h-10 bg-[#ede9fe] rounded-full items-center justify-center mr-4">
                  <Ionicons name="mail" size={18} color="#4f46e5" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-500 tracking-wider mb-0.5">EMAIL</Text>
                  <Text className="text-[14px] font-semibold text-slate-900">alex.rivera@design.co</Text>
                </View>
                <TouchableOpacity className="p-2">
                  <Feather name="send" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Location */}
              <View className="flex-row items-center bg-[#f5f3ff] rounded-2xl p-4 mb-2">
                <View className="w-10 h-10 bg-[#ede9fe] rounded-full items-center justify-center mr-4">
                  <Ionicons name="location" size={18} color="#4f46e5" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-slate-500 tracking-wider mb-0.5">LOCATION</Text>
                  <Text className="text-[14px] font-semibold text-slate-900">San Francisco, CA</Text>
                </View>
                <TouchableOpacity className="p-2">
                  <Feather name="map" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

            </View>

            {/* Save Contact Button */}
            <TouchableOpacity className="w-full bg-[#6d28d9] rounded-2xl py-4 shadow-sm h-14 justify-center items-center">
              <Text className="text-white font-semibold text-[15px]">Save Contact</Text>
            </TouchableOpacity>

          </View>

          {/* Bottom Gray Section for QR Code */}
          <View className="bg-[#f1f5f9] items-center pt-8 pb-10">
            <View className="bg-[#334155] p-1.5 shadow-lg mb-6 rounded-md">
              <View className="bg-white p-3">
                <Ionicons name="qr-code-outline" size={60} color="#334155" />
              </View>
            </View>
            <Text className="text-[11px] font-bold text-slate-600 tracking-widest">SCAN TO CONNECT INSTANTLY</Text>
          </View>

        </View>

        {/* Updated Text */}
        <Text className="text-center text-[#a78bfa] mt-4 text-[13px]">Last updated Oct 2023</Text>
      </View>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-around items-center pt-3 pb-8 border-t border-slate-100 rounded-t-[32px]">
        <TouchableOpacity className="items-center" onPress={() => setActiveTab('MyCard')}>
          <View className={`w-16 items-center justify-center py-2 rounded-2xl ${activeTab === 'MyCard' ? 'bg-[#f5f3ff]' : ''}`}>
            <Ionicons name="person-circle-outline" size={26} color={activeTab === 'MyCard' ? "#4f46e5" : "#94a3b8"} />
            <Text className={`text-[10px] font-bold mt-1 ${activeTab === 'MyCard' ? 'text-indigo-600' : 'text-slate-400'}`}>My Card</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => setActiveTab('Contacts')}>
          <View className="w-16 items-center justify-center py-2">
            <Ionicons name="people" size={26} color="#94a3b8" />
            <Text className="text-[10px] font-bold mt-1 text-slate-400">Contacts</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={() => setActiveTab('Scan')}>
          <View className="w-16 items-center justify-center py-2">
            <Ionicons name="scan-outline" size={26} color="#94a3b8" />
            <Text className="text-[10px] font-bold mt-1 text-slate-400">Scan</Text>
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
