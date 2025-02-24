import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Avatar,
  IconButton,
} from "@mui/material";
import FriendsWidget from "../widgets/FriendWidget";
import { useTheme } from "@mui/material/styles";
import {
  FavoriteBorder,
  Favorite,
  CheckCircleOutline,
  Explore,
  TrendingUp,
  FlightTakeoff,
  People,
  Checklist,
  LocationOn,
} from "@mui/icons-material";
import useUser from "../../../hooks/useUser";

const Dashboard = () => {
  const theme = useTheme();
  const { user, jwt } = useUser();
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Book Flight Tickets", checked: false },
    { id: 2, text: "Reserve Accommodation", checked: false },
    { id: 3, text: "Plan Itinerary", checked: false },
    { id: 4, text: "Exchange Currency", checked: false },
  ]);

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "auto",
        gap: 3,
        p: 3,
        justifyContent: "space-around",
      }}
    >
      {/* Ongoing and Following Trips - 50% Width */}
      <Box sx={{ gridColumn: "span 2" }}>
        <Card
          sx={{
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            borderRadius: "10px",
            height: "240px",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              ✈️ Ongoing Trip
            </Typography>
            <Typography variant="h4" fontWeight="600">
              📍 Tokyo, Japan
            </Typography>
            <Typography>🗓️ Feb 10 - Feb 25</Typography>
            <Typography>🏨 Staying at: Shibuya Hotel</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            marginTop: 3,
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            borderRadius: "10px",
            height: "240px",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              ✈️ Next Trip
            </Typography>
            <Typography variant="h4" fontWeight="600">
              📍 Kyoto, Japan
            </Typography>
            <Typography>🗓️ March 5 - March 15</Typography>
            <Typography>🏨 Staying at: Kyoto Ryokan</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* User List and Checklist - Right Side */}
      <Box sx={{ gridColumn: "span 1" }}>
        {" "}
        <Card
          sx={{
            backgroundColor: theme.palette.primary.white,
            borderRadius: "10px",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.palette.primary.main}
            >
              Travel Checklist
            </Typography>
            <List>
              {checklist.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  <Checkbox
                    checked={item.checked}
                    icon={
                      <CheckCircleOutline
                        sx={{ color: theme.palette.grey[500] }}
                      />
                    }
                  />
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Box marginTop={3}>
          <FriendsWidget token={jwt} />
        </Box>
      </Box>

      {/* Remaining Content at the Bottom */}
      <Card
        sx={{
          gridColumn: "span 3",
          backgroundColor: theme.palette.grey[800],
          borderRadius: "20px",
          height: "200px",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            🏆 Friends Activity
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mt={1}>
            <Avatar src="/friend1.jpg" />
            <Typography>Jane completed the Japan Rail Challenge! 🚄</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          gridColumn: "span 1",
          backgroundColor: theme.palette.grey[800],
          borderRadius: "20px",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            🌟 Favorite Experiences
          </Typography>
          <List>
            <ListItem>
              <Explore /> <ListItemText primary="Mt. Fuji Hiking Adventure" />
            </ListItem>
            <ListItem>
              <FlightTakeoff />{" "}
              <ListItemText primary="Shinkansen Ride to Kyoto" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card
        sx={{
          gridColumn: "span 2",
          backgroundColor: theme.palette.grey[700],
          borderRadius: "20px",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            🔥 Most Popular Posts
          </Typography>
          <List>
            <ListItem>
              <TrendingUp />{" "}
              <ListItemText primary="Top 5 Hidden Gems in Japan" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
