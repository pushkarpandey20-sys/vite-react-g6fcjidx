import React from 'react';

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const base = {
  background: 'linear-gradient(90deg, #f0e6d8 25%, #f8f0e4 50%, #f0e6d8 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 8,
};

export function SkeletonText({ width='100%', height=16, style={} }) {
  return <><style>{shimmer}</style><div style={{ ...base, width, height, ...style }} /></>;
}

export function SkeletonCard({ style={} }) {
  return (
    <><style>{shimmer}</style>
    <div style={{ background:'#fff', border:'1px solid rgba(212,160,23,0.15)', borderRadius:14, padding:18, ...style }}>
      <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ ...base, width:48, height:48, borderRadius:'50%', flexShrink:0 }}/>
        <div style={{ flex:1 }}>
          <div style={{ ...base, height:16, marginBottom:8 }}/>
          <div style={{ ...base, height:12, width:'70%' }}/>
        </div>
      </div>
      <div style={{ ...base, height:12, marginBottom:6 }}/>
      <div style={{ ...base, height:12, width:'85%', marginBottom:12 }}/>
      <div style={{ ...base, height:36, borderRadius:10 }}/>
    </div></>
  );
}

export function SkeletonPanditGrid({ count=6 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
      {Array.from({length:count}).map((_,i) => <SkeletonCard key={i}/>)}
    </div>
  );
}
