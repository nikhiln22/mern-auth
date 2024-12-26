import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/Store";

const Home = () => {
  const userData = useSelector((state: RootState) => {
    return state.user.user?.name;
  });
  const learningStats = [
    {
      title: "My Courses",
      value: "3 Active",
      color: "bg-blue-100",
    },
    {
      title: "Study Hours",
      value: "12.5 hrs",
      color: "bg-green-100",
    },
    {
      title: "Achievements",
      value: "5 Badges",
      color: "bg-purple-100",
    },
    {
      title: "Rating",
      value: "4.8/5.0",
      color: "bg-yellow-100",
    },
  ];

  const upcomingClasses = [
    {
      title: "JavaScript Basics",
      time: "2:00 PM Today",
      instructor: "Pranav",
    },
    {
      title: "React Fundamentals",
      time: "10:00 AM Tomorrow",
      instructor: "Nikhil",
    },
    {
      title: "Web Design",
      time: "3:00 PM Wednesday",
      instructor: "Afra",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {userData}!
        </h2>
        <p className="text-gray-600 mt-2">Here's your learning progress</p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {learningStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold mt-2 text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Upcoming Classes */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Upcoming Classes
        </h3>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <div>
                  <h4 className="font-medium text-gray-800">{class_.title}</h4>
                  <p className="text-sm text-gray-600">{class_.time}</p>
                  <p className="text-sm text-gray-500">
                    Instructor: {class_.instructor}
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-6xl mx-auto mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["My Profile", "Course Catalog", "Discussion Forum"].map(
            (link, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <p className="text-center text-gray-800 font-medium">{link}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
