const Task = require('../models/Task');

// @desc    Get task analytics for current user
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      statusStats,
      priorityStats,
      overdueCount,
      recentTasks,
      completionByDay
    ] = await Promise.all([
      // Tasks by status
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Tasks by priority
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),

      // Overdue tasks (not done and past due date)
      Task.countDocuments({
        user: userId,
        status: { $ne: 'Done' },
        dueDate: { $lt: new Date(), $ne: null }
      }),

      // Recent 5 tasks
      Task.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status priority createdAt')
        .lean(),

      // Completed tasks per day (last 7 days)
      Task.aggregate([
        {
          $match: {
            user: userId,
            status: 'Done',
            completedAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$completedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Process status stats
    const statusMap = { Todo: 0, 'In Progress': 0, Done: 0 };
    statusStats.forEach(s => { statusMap[s._id] = s.count; });

    const total = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const completed = statusMap['Done'];
    const pending = statusMap['Todo'] + statusMap['In Progress'];
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Process priority stats
    const priorityMap = { Low: 0, Medium: 0, High: 0 };
    priorityStats.forEach(p => { priorityMap[p._id] = p.count; });

    res.json({
      success: true,
      data: {
        overview: {
          total,
          completed,
          pending,
          inProgress: statusMap['In Progress'],
          overdue: overdueCount,
          completionPercentage
        },
        byStatus: statusMap,
        byPriority: priorityMap,
        recentTasks,
        completionByDay
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics };
