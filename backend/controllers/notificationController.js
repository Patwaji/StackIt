import Notification from "../models/notification.js";

export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching for user:", userId);

    const all = await Notification.find().lean();
    console.log("All notifications in DB:", all.length);

    const notifications = await Notification.find({ user: userId })
      .populate("fromUser", "name email")
      .populate("question", "title _id")
      .populate("reply", "text _id")
      .sort({ createdAt: -1 });

    console.log("Filtered notifications:", notifications.length);

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
