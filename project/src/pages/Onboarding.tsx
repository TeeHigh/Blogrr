import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Camera, User, Heart, ArrowRight, ArrowLeft, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const GENRES = [
  'Technology', 'Web Development', 'Mobile Development', 'AI & Machine Learning',
  'Design', 'UI/UX', 'Graphic Design', 'Product Design',
  'Business', 'Entrepreneurship', 'Marketing', 'Finance',
  'Lifestyle', 'Travel', 'Food', 'Health & Fitness',
  'Science', 'Education', 'Politics', 'Environment',
  'Entertainment', 'Gaming', 'Movies', 'Music',
  'Sports', 'Photography', 'Art', 'Writing'
];

const SAMPLE_AVATARS = [
  'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150'
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    avatar: '',
    bio: '',
    genres: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.emailVerified) {
    return <Navigate to="/login" replace />;
  }

  if (user.genres && user.genres.length > 0) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGenreToggle = (genre: string) => {
    setProfileData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      await updateProfile({
        avatar: profileData.avatar || SAMPLE_AVATARS[0],
        bio: profileData.bio,
        genres: profileData.genres
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true; // Avatar is optional
      case 2: return profileData.bio.trim().length > 0;
      case 3: return profileData.genres.length >= 3;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Camera className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Add a profile picture</h2>
              <p className="text-gray-600">Help others recognize you in the community</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => setShowAvatarOptions(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {showAvatarOptions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Choose Avatar</h3>
                      <button
                        onClick={() => setShowAvatarOptions(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {SAMPLE_AVATARS.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setProfileData(prev => ({ ...prev, avatar }));
                            setShowAvatarOptions(false);
                          }}
                          className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-colors ${
                            profileData.avatar === avatar ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <button
                        onClick={() => {
                          // In a real app, this would open file picker
                          alert('File upload would be implemented here');
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Upload custom image
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                You can skip this step and add a photo later
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
              <p className="text-gray-600">Write a brief bio that describes who you are and what you write about</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="I'm a passionate writer who loves to share insights about..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={200}
              />
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {profileData.bio.length}/200 characters
                </span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Heart className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What are you interested in?</h2>
              <p className="text-gray-600">Select at least 3 topics you're passionate about</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      profileData.genres.includes(genre)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-gray-500">
                Selected: {profileData.genres.length} / {GENRES.length}
                {profileData.genres.length < 3 && (
                  <span className="text-orange-600 ml-2">
                    (Select at least 3)
                  </span>
                )}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-8">
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed() || loading}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}