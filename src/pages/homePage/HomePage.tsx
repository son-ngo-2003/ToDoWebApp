import React from 'react';
import { TaskListView } from '@src/components';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
    return (
        <>
            <h1 className="title">All Tasks</h1>
            <div className="separate-line"/>
            <TaskListView />
        </>
    );
};

export default HomePage;