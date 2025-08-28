import { Heart } from "lucide-react";
import { useOnboardingContext } from "../../contexts/OnboardingContext";

function GenreStep() {
  const {GENRES, profileData, handleGenreToggle} = useOnboardingContext();

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
          <Heart className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          What are you interested in?
        </h2>
        <p className="text-gray-600">
          Select at least 3 topics you're passionate about
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                profileData.genres.includes(genre)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500">
          Selected: {profileData.genres.length} / {GENRES.length}
          {profileData.genres.length < 3 && (
            <span className="text-orange-600 ml-2">(Select at least 3)</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default GenreStep;
