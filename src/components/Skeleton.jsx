import './Skeleton.css';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) {
    return (
        <div 
            className={`skeleton-base ${className}`} 
            style={{ 
                width, 
                height, 
                borderRadius 
            }}
        ></div>
    );
}
