"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button 
} from '@mui/material';

interface Member {
  memberId: string;
  memberType: string;
  name: string;
  isConvener: boolean;
}

interface Subcommittee {
  _id: string;
  name: string;
  members: Member[];
}

const Subcommittees: React.FC = () => {
  const [subcommittees, setSubcommittees] = useState<Subcommittee[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubcommittees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/subcommittees');
      const sortedSubcommittees = response.data.sort((a: Subcommittee, b: Subcommittee) => {
        const order = ['Transport', 'Revenue', 'Travel'];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
      setSubcommittees(sortedSubcommittees);
    } catch (error) {
      console.error('Error fetching subcommittees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (subcommitteeId: string, memberId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/subcommittees/${subcommitteeId}/members/${memberId}`);
      // Refresh the list of subcommittees
      fetchSubcommittees();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  useEffect(() => {
    fetchSubcommittees(); // Initial fetch
  }, []);

  return (
    <div className="container mx-auto">
      <Grid container spacing={4}>
        {loading && <p>Loading...</p>}
        {subcommittees.length === 0 ? (
          <p>No subcommittees available.</p>
        ) : (
          subcommittees.map((subcommittee) => (
            <Grid item xs={12} md={4} key={subcommittee._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {subcommittee.name}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Member Type</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subcommittee.members.map((member) => (
                          <TableRow key={member.memberId}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{member.memberType}</TableCell>
                            <TableCell>{member.isConvener ? 'Convener' : 'Member'}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDeleteMember(subcommittee._id, member.memberId)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default Subcommittees;
