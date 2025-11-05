import type { PhaserDataInspectorMessage } from '../store/types';

export const PreviewStateEvent = ({ event, onClose }: { event: PhaserDataInspectorMessage, onClose: () => void }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1, }}>
            <button style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => onClose()}>X</button>
            <pre>{JSON.stringify(event.newValue, null, 2)}</pre>
        </div>
    );
}; 
