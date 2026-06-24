import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer style={{ 
            backgroundColor: '#fff',
            padding: '15px', 
            marginTop: 'auto',
        }}>
            <div style={{ 
                maxWidth: '1400px', 
                margin: '0 auto', 
                display: 'flex', 
                flexWrap: 'wrap',
                alignItems: 'center', 
                justifyContent: 'space-between', 
                gap: '20 px' 
            }}>
                <div style={{ display: 'flex',alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                    <h3 style={{marginBottom: '0', color: '#fe424d' }}>Prime Nova</h3>
                    <p style={{ color: '#000000be', fontSize: '0.7rem', position: 'relative', bottom: '-3px' }}>Private Limited.</p>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '5px' }}>
                    <Link to="/about" style={{ color: '#000000be', fontSize: '0.9rem' }}>About</Link>
                    <Link to="/return" style={{ color: '#000000be', fontSize: '0.9rem' }}>Return Policy</Link>
                    <Link to="/disclaimer" style={{ color: '#000000be', fontSize: '0.9rem' }}>Disclaimer</Link>
                </div>
                
                <div style={{  color: '#000000be', fontSize: '0.9rem', marginBottom: '5px' }}>
                    &copy; {new Date().getFullYear()} Prime Nova. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;