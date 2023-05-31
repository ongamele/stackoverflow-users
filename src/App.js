import React, { useEffect, useState } from "react";
import "./App.css";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUserData, setFilteredUserData] = useState();

  //This function handles storing and retrieving data from the cache.
  function setCacheData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function getCacheData(key) {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }
  const fetchTopUsers = () => {
    const cacheKey =
      "http://api.stackexchange.com/2.2/users?pagesize=20&order=desc&sort=reputation&site=stackoverflow";
    const cachedData = getCacheData(cacheKey);

    //Here we check if the data is already present in the cache. If it is, retrieve it from the cache instead of making the actual API call.
    if (cachedData) {
      setUsers(cachedData.items);
    } else {
      fetch(
        "http://api.stackexchange.com/2.2/users?pagesize=20&order=desc&sort=reputation&site=stackoverflow"
      )
        .then((response) => response.json())
        .then((data) => {
          // Store data in cache
          setCacheData(cacheKey, data.items);

          // Update state with API data
          setUsers(data.items);
        })
        .catch(() => {
          setError(true);
        });
    }
  };

  useEffect(() => {
    fetchTopUsers();
  }, []);

  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  useEffect(() => {
    //When a user types in the search box this filters data and retrieve users with names that include what is in the seearch box.
    const filteredData = users.filter((user) =>
      user.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUserData(filteredData);
  }, [searchQuery]);

  //functions to expand user to show options to follow, unfollow and block users when the click on the user card.
  const handleExpandUser = (userId) => {
    setExpandedUser(userId === expandedUser ? null : userId);
  };
  //Function to enable follow user upon clicking a 'follow' text.
  const handleFollowUser = (userId) => {
    const isFollowed = followedUsers.includes(userId);
    if (isFollowed) {
      setFollowedUsers(followedUsers.filter((id) => id !== userId));
    } else {
      setFollowedUsers([...followedUsers, userId]);
    }
  };
  //Function to block a user
  const handleBlockUser = (userId) => {
    const isBlocked = blockedUsers.includes(userId);
    if (!isBlocked) {
      setBlockedUsers([...blockedUsers, userId]);
    }
  };

  return (
    <Stack spacing={4} style={{ margin: 12 }}>
      <Typography variant="h2" component="h2">
        Stack Overflow Top Users
      </Typography>

      {error ? (
        <p>Error: Unable to fetch users. Please try again later.</p>
      ) : (
        <>
          <TextField
            label="Search"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {searchQuery
            ? filteredUserData.map((user) => {
                const { user_id, display_name, profile_image, reputation } =
                  user;
                const isFollowed = followedUsers.includes(user_id);
                const isBlocked = blockedUsers.includes(user_id);
                const isExpanded = user_id === expandedUser;

                return (
                  <div style={{ marginBottom: 20 }} key={user_id}>
                    <Card
                      sx={{ maxWidth: 345 }}
                      onClick={() => handleExpandUser(user_id)}
                      style={{
                        backgroundColor: isBlocked ? "lightgray" : "white",
                        margin: 10,
                        cursor: "pointer",
                      }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ bgcolor: red[500] }}
                            aria-label="recipe">
                            {display_name.charAt(0)}
                          </Avatar>
                        }
                        title={display_name}
                      />
                      <CardMedia
                        component="img"
                        height="194"
                        image={profile_image}
                        alt="Paella dish"
                      />
                      <CardContent>
                        <Typography
                          variant="h4"
                          component="h4"
                          style={{ color: "#540A60" }}>
                          Reputation {reputation}
                        </Typography>
                        {isFollowed && (
                          <p style={{ color: "#009963" }}>Following</p>
                        )}
                        {isExpanded && (
                          <>
                            {!isBlocked && (
                              <Button
                                size="small"
                                color="success"
                                onClick={() => handleFollowUser(user_id)}>
                                {isFollowed ? "Unfollow" : "Follow"}
                              </Button>
                            )}
                            {!isBlocked && (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleBlockUser(user_id)}>
                                Block
                              </Button>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            : users.map((user) => {
                const { user_id, display_name, profile_image, reputation } =
                  user;
                const isFollowed = followedUsers.includes(user_id);
                const isBlocked = blockedUsers.includes(user_id);
                const isExpanded = user_id === expandedUser;

                return (
                  <div style={{ marginBottom: 20 }} key={user_id}>
                    <Card
                      sx={{ maxWidth: 345 }}
                      onClick={() => handleExpandUser(user_id)}
                      style={{
                        backgroundColor: isBlocked ? "lightgray" : "white",
                        margin: 10,
                        cursor: "pointer",
                      }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ bgcolor: red[500] }}
                            aria-label="recipe">
                            {display_name.charAt(0)}
                          </Avatar>
                        }
                        title={display_name}
                      />
                      <CardMedia
                        component="img"
                        height="194"
                        image={profile_image}
                        alt="Paella dish"
                      />
                      <CardContent>
                        <Typography
                          variant="h4"
                          component="h4"
                          style={{ color: "#540A60" }}>
                          Reputation {reputation}
                        </Typography>
                        {isFollowed && (
                          <p style={{ color: "#008053" }}>Following</p>
                        )}
                        {isExpanded && (
                          <>
                            {!isBlocked && (
                              <Button
                                size="small"
                                color="success"
                                onClick={() => handleFollowUser(user_id)}>
                                {isFollowed ? "Unfollow" : "Follow"}
                              </Button>
                            )}
                            {!isBlocked && (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleBlockUser(user_id)}>
                                Block
                              </Button>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
        </>
      )}
    </Stack>
  );
}

export default App;
