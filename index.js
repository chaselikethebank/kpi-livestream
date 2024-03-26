// Constants
const YOUTUBE_API_KEY = "";
const YOUTUBE_API_ENDPOINT = "https://www.googleapis.com/youtube/v3";

// Array of channel IDs
const channelIds = [
  "UC3wbHKvd10yNK4Ob5NPvnDw", // The Rebelbase
  "C3dMRCHHn313GZ50q0szezw",  // The Woodlands Methodist Church
  "ClYsncuu6rBhsh2lYYb0zdQ",  // Harvest TWMC
  "UCP7ezytRb2i4njgDxhwHFTg"  // The Church at Woodforest
];

// Function to fetch video data for a selected channel
async function fetchChannelData(channelId) {
  try {
    const response = await $.get(`${YOUTUBE_API_ENDPOINT}/search`, {
      key: YOUTUBE_API_KEY,
      channelId: channelId,
      part: "snippet",
      type: "video",
      eventType: "completed",
      maxResults: 50, 
    });
    return response.items;
  } catch (error) {
    console.error("Error fetching channel data:", error);
    return [];
  }
}

// Function to update the table with fetched channel data
async function updateChannelTable(channelId) {
  const channelDataBody = $("#channelDataBody");
  channelDataBody.empty(); // Clear previous data

  const channelData = await fetchChannelData(channelId);

  channelData.forEach((item) => {
    const snippet = item.snippet;
    const videoId = item.id.videoId;
    const formattedDate = new Date(snippet.publishedAt).toLocaleDateString("en-US");
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    const row = `<tr>
                    <td>${snippet.title}</td>
                    <td>${formattedDate}</td>
                    <td>${snippet.viewCount}</td>
                    <td>${snippet.likeCount}</td>
                    <td>${videoId}</td>
                    <td><a href="${videoLink}" target="_blank">Watch Video</a></td>
                </tr>`;
    channelDataBody.append(row);
  });
}

// Initialization
$(document).ready(() => {
  // Listen for changes in the channel selector dropdown
  $("#channelSelector").change(function () {
    const selectedChannelId = $(this).val();
    updateChannelTable(selectedChannelId);
  });

  // Fetch and display data for the default selected channel
  const defaultChannelId = $("#channelSelector").val();
  updateChannelTable(defaultChannelId);
});
