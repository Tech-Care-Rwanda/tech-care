"use client"

import { useState } from "react"
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  Smartphone,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Key,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/contexts/AuthContext"

interface SettingsState {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    marketing: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts'
    showOnlineStatus: boolean
    allowDirectContact: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: 'en' | 'rw' | 'fr'
    soundEffects: boolean
    autoLogout: boolean
  }
  security: {
    twoFactorAuth: boolean
    loginAlerts: boolean
    sessionTimeout: number
  }
}

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowDirectContact: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      soundEffects: true,
      autoLogout: false
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30
    }
  })

  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  const updateNotificationSetting = (key: keyof SettingsState['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updatePrivacySetting = (key: keyof SettingsState['privacy'], value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }))
  }

  const updatePreferenceSetting = (key: keyof SettingsState['preferences'], value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  const updateSecuritySetting = (key: keyof SettingsState['security'], value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }))
  }

  const saveSettings = () => {
    // TODO: Save settings to backend
    console.log('Saving settings:', settings)
    // Show success message
  }

  const exportData = () => {
    // TODO: Export user data
    console.log('Exporting user data...')
  }

  const deleteAccount = () => {
    // TODO: Delete account
    console.log('Deleting account...')
    logout()
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please sign in to access settings</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your application preferences and account settings</p>
        </div>
        
        <Button onClick={saveSettings} className="bg-red-500 hover:bg-red-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-red-500" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive booking updates via email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-500">Get real-time notifications on your device</p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-500">Receive important updates via SMS</p>
              </div>
              <Switch
                checked={settings.notifications.sms}
                onCheckedChange={(checked) => updateNotificationSetting('sms', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Marketing Communications</h4>
                <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
              </div>
              <Switch
                checked={settings.notifications.marketing}
                onCheckedChange={(checked) => updateNotificationSetting('marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-red-500" />
              <span>Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Profile Visibility</h4>
              <p className="text-sm text-gray-500 mb-3">Control who can see your profile information</p>
              <div className="space-y-2">
                {[
                  { value: 'public', label: 'Public - Anyone can see your profile' },
                  { value: 'private', label: 'Private - Only you can see your profile' },
                  { value: 'contacts', label: 'Contacts only - Only saved technicians/customers' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value={option.value}
                      checked={settings.privacy.profileVisibility === option.value}
                      onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Show Online Status</h4>
                <p className="text-sm text-gray-500">Let others see when you're online</p>
              </div>
              <Switch
                checked={settings.privacy.showOnlineStatus}
                onCheckedChange={(checked) => updatePrivacySetting('showOnlineStatus', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Allow Direct Contact</h4>
                <p className="text-sm text-gray-500">Allow others to contact you directly</p>
              </div>
              <Switch
                checked={settings.privacy.allowDirectContact}
                onCheckedChange={(checked) => updatePrivacySetting('allowDirectContact', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-red-500" />
              <span>Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Theme</h4>
              <div className="flex space-x-2">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Smartphone }
                ].map((theme) => {
                  const Icon = theme.icon
                  return (
                    <button
                      key={theme.value}
                      onClick={() => updatePreferenceSetting('theme', theme.value)}
                      className={`flex flex-col items-center space-y-1 p-3 rounded-md border-2 transition-colors ${
                        settings.preferences.theme === theme.value
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{theme.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Language</h4>
              <select
                value={settings.preferences.language}
                onChange={(e) => updatePreferenceSetting('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="rw">Kinyarwanda</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {settings.preferences.soundEffects ? (
                  <Volume2 className="w-4 h-4 text-gray-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Sound Effects</h4>
                  <p className="text-sm text-gray-500">Play sounds for notifications and actions</p>
                </div>
              </div>
              <Switch
                checked={settings.preferences.soundEffects}
                onCheckedChange={(checked) => updatePreferenceSetting('soundEffects', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Auto Logout</h4>
                <p className="text-sm text-gray-500">Automatically logout after 30 minutes of inactivity</p>
              </div>
              <Switch
                checked={settings.preferences.autoLogout}
                onCheckedChange={(checked) => updatePreferenceSetting('autoLogout', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={settings.security.twoFactorAuth}
                onCheckedChange={(checked) => updateSecuritySetting('twoFactorAuth', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Login Alerts</h4>
                <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
              </div>
              <Switch
                checked={settings.security.loginAlerts}
                onCheckedChange={(checked) => updateSecuritySetting('loginAlerts', checked)}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Session Timeout</h4>
              <p className="text-sm text-gray-500 mb-3">Minutes of inactivity before automatic logout</p>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific Settings */}
        {user.role === 'technician' && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-red-500" />
                <span>Technician Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Service Area</h4>
                  <p className="text-sm text-gray-500 mb-3">Define the areas where you provide services</p>
                  <Button variant="outline" size="sm">
                    Configure Service Area
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Working Hours</h4>
                  <p className="text-sm text-gray-500 mb-3">Set your availability schedule</p>
                  <Button variant="outline" size="sm">
                    Set Working Hours
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Service Rates</h4>
                  <p className="text-sm text-gray-500 mb-3">Manage your pricing for different services</p>
                  <Button variant="outline" size="sm">
                    Update Rates
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Portfolio</h4>
                  <p className="text-sm text-gray-500 mb-3">Showcase your work and certifications</p>
                  <Button variant="outline" size="sm">
                    Manage Portfolio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="lg:col-span-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Danger Zone</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteAccount(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>

            {showDeleteAccount && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-900 mb-2">Are you absolutely sure?</h4>
                    <p className="text-sm text-red-600 mb-3">
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={deleteAccount}
                      >
                        Yes, delete my account
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowDeleteAccount(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

 