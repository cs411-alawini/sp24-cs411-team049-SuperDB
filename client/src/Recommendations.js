import React from 'react';
import { Card, Button } from '@material-ui/core';

const Recommendations = ({ insights, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowX: 'auto',
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '10px',
      color: 'white',
      maxWidth: '80%',
      maxHeight: '80%',
      overflowY: 'auto'
    }}>
      <Button onClick={onClose} style={{
        alignSelf: 'flex-end',
        color: 'white',
        borderColor: 'white'
      }}>
        Close
      </Button>
      <h2 style={{ textAlign: 'center', margin: '10px 0' }}>
        Explore Top Recommended Properties Just for You!
      </h2>
      {insights.map((insight, index) => (
        <Card key={index} style={{
          minWidth: '300px',
          margin: '10px',
          backgroundColor: '#fff'
        }}>
          {insight.imageUrl ? (
            <img src={insight.imageUrl} alt={insight.propertyName || 'Property'} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccc' }}>
              No image available
            </div>
          )}
          <div style={{ padding: '10px' }}>
            <h3>{insight.propertyName || 'Unknown Property'}</h3>
            <p>{insight.description || 'No description available.'}</p>
            <p><b>{insight.insight || 'No specific insights available.'}</b></p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.href = `/properties/${insight.propertyID}`}
            >
              View Property
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Recommendations;
