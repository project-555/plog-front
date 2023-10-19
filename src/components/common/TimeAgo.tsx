import React from 'react';
import {formatDistanceToNow} from 'date-fns';
import {ko} from 'date-fns/locale';

interface TimeAgoProps {
    timestamp: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({timestamp}) => {
    const timeAgo = formatDistanceToNow(new Date(timestamp), {addSuffix: true, locale: ko});
    return <span style={{color:'var(--text1)'}}>{timeAgo}</span>;
};

export default TimeAgo;
