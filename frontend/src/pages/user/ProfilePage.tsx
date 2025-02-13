import Header from "../../components/user/Header";
import Profile from "../../components/user/Profile";

const ProfilePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="py-12 my-4">
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;

