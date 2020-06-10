import React from "react";
import { useParams } from "react-router-dom";

export default function Room() {
    const { roomId } = useParams();
    
    return (
        <h2>Welcome to room {roomId}</h2>
    );
}