// src/components/admin/MatchListItem.tsx
import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'; 
import type { Match, MatchStatus } from '../../../types/match';

interface MatchListItemProps {
  match: Match;
  onDelete: (matchId: string) => void;
  // onEdit: (matchId: string) => void; // If you prefer explicit edit button
  // onManageLive: (matchId: string) => void; // If you prefer explicit live manage button
}

// Helper to get chip color based on match status
const getStatusChipColor = (status: MatchStatus) => {
  switch (status) {
    case 'Ongoing': return 'success';
    case 'Upcoming': return 'info';
    case 'Completed': return 'default';
    default: return 'default';
  }
};

const MatchListItem: React.FC<MatchListItemProps> = ({ match, onDelete }) => {
  const formattedDate = format(new Date(match.date), 'MMM dd, yyyy hh:mm a');

  return (
    <ListItem divider>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
              {match.name}: {match.team1Name} vs {match.team2Name}
            </Typography>
            <Chip
              label={match.status}
              color={getStatusChipColor(match.status)}
              size="small"
            />
          </Box>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            {formattedDate} - {match.venue}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        {match.status !== 'Completed' && (
          <IconButton
            edge="end"
            aria-label="manage live"
            component={Link}
            to={`/admin/matches/${match.id}/live`}
            sx={{ mr: 1 }}
            title="Manage Live Score"
          >
            <PlayArrowIcon color="primary" />
          </IconButton>
        )}
        <IconButton
          edge="end"
          aria-label="edit"
          component={Link}
          to={`/admin/matches/${match.id}`} // Route to edit existing match
          sx={{ mr: 1 }}
          title="Edit Match Details"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="view scorecard"
          component={Link}
          to={`/match/${match.id}`} // Public scorecard view
          sx={{ mr: 1 }}
          title="View Public Scorecard"
        >
          <ScoreboardIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(match.id)}
          title="Delete Match"
        >
          <DeleteIcon color="error" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default MatchListItem;