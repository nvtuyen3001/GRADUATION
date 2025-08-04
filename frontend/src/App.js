import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Homepage Component
const HomePage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Initialize sample data first
        await axios.post(`${API}/init-data`);
        
        // Then fetch friends
        const response = await axios.get(`${API}/friends`);
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-400">
        <div className="text-2xl font-semibold text-orange-800">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-400 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-800 mb-4">
            LỄ TỐT NGHIỆP 2025
          </h1>
          <p className="text-xl text-orange-700">
            Nguyen Van Tuyen
          </p>
          <p className="text-lg text-orange-600 mt-2">
            Mời các bạn tham dự lễ tốt nghiệp
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-8">
            Danh sách bạn bè
          </h2>
          
          <div className="space-y-4">
            {friends.map((friend) => (
              <Link
                key={friend.id}
                to={`/invite/${friend.id}`}
                className="block p-6 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-orange-200 hover:border-orange-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-orange-800">
                    {friend.name}
                  </span>
                  <span className="text-orange-600 font-medium">
                    Nhấn để mở thiệp mời →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Personal Invitation Page Component
const InvitationPage = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get(`${API}/friends/${friendId}`);
        setFriend(response.data);
      } catch (error) {
        console.error('Error fetching friend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriend();
  }, [friendId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-400">
        <div className="text-2xl font-semibold text-orange-800">Đang tải...</div>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-400">
        <div className="text-2xl font-semibold text-red-600">Không tìm thấy bạn bè!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-400 flex items-center justify-center py-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-lg mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Ngày 19/8/2025
          </h1>
          <div className="w-16 h-1 bg-red-500 mx-auto mb-6"></div>
          <p className="text-lg text-red-600 font-semibold leading-relaxed">
            Bạn đã chọn ngày để đến dự lễ tốt nghiệp của tôi
          </p>
        </div>

        <button
          onClick={() => navigate(`/ceremony/${friendId}`)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-2xl px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Ngày
        </button>

        <div className="mt-8">
          <Link
            to="/"
            className="text-orange-600 hover:text-orange-800 underline font-medium"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

// Detailed Ceremony Page Component
const CeremonyPage = () => {
  const { friendId } = useParams();
  const [friend, setFriend] = useState(null);
  const [graduationInfo, setGraduationInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendResponse, graduationResponse] = await Promise.all([
          axios.get(`${API}/friends/${friendId}`),
          axios.get(`${API}/graduation-info`)
        ]);
        setFriend(friendResponse.data);
        setGraduationInfo(graduationResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [friendId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-yellow-200">
        <div className="text-2xl font-semibold text-orange-800">Đang tải...</div>
      </div>
    );
  }

  if (!friend || !graduationInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-yellow-200">
        <div className="text-2xl font-semibold text-red-600">Không tìm thấy thông tin!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-sm text-orange-800 font-medium mb-2">
            FPT Education
          </div>
          <div className="text-lg text-orange-800 font-bold mb-6">
            FPT UNIVERSITY
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-400 to-yellow-300 p-8 text-center">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-wide">
              GRADUATION
            </h1>
            <h2 className="text-6xl font-bold text-white mb-4 tracking-wide">
              CEREMONY
              <span className="text-4xl ml-4 text-yellow-200">2025</span>
            </h2>
            <p className="text-2xl text-white/90 italic font-light">
              Thread of Connection
            </p>
          </div>

          {/* Graduate Info */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                TÂN CỬ NHÂN
              </h3>
              <h2 className="text-4xl font-bold text-orange-800 mb-4">
                {graduationInfo.graduate_name.toUpperCase()}
              </h2>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                CHUYÊN NGÀNH
              </h4>
              <p className="text-2xl text-orange-700 font-medium">
                {graduationInfo.major.toUpperCase()}
              </p>
            </div>

            {/* Personalized Message */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 mb-8">
              <p className="text-xl font-semibold text-orange-800 italic">
                This invitation is for: {friend.name}
              </p>
            </div>

            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-6 text-lg">
              <div className="bg-orange-50 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl mr-2">⏰</span>
                  <span className="font-bold text-orange-800">Thời gian</span>
                </div>
                <p className="text-orange-700 font-medium">
                  {graduationInfo.time} - {graduationInfo.date}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl mr-2">📍</span>
                  <span className="font-bold text-orange-800">Địa điểm</span>
                </div>
                <p className="text-orange-700 font-medium">
                  {graduationInfo.location}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6">
              <p className="text-orange-700 font-medium leading-relaxed">
                {graduationInfo.address}
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/invite/:friendId" element={<InvitationPage />} />
          <Route path="/ceremony/:friendId" element={<CeremonyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;