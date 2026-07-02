import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer style={{ 
            backgroundColor: '#fff',
            padding: '15px', 
            marginTop: 'auto',
        }}>
            <div style={{   
                display: 'flex', 
                flexWrap: 'wrap',
                alignItems: 'center', 
                justifyContent: 'space-between', 
                gap: '20 px' 
            }}>
                <div style={{ display: 'flex',alignItems: 'center', gap: '2px', marginBottom: '5px' }}>
                    <h3 style={{marginBottom: '0', color: '#fe424d' }}>Hivbnb</h3>
                    <p style={{ color: '#000000be', fontSize: '0.7rem', position: 'relative', bottom: '-3px' }}>Private Limited.</p>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '5px' }}>
                    <Link to="/about" style={{ color: '#000000be', fontSize: '0.9rem' }}>About</Link>
                    <Link to="/return" style={{ color: '#000000be', fontSize: '0.9rem' }}>Return Policy</Link>
                    <Link to="/disclaimer" style={{ color: '#000000be', fontSize: '0.9rem' }}>Disclaimer</Link>
                </div>
                
                <div style={{  color: '#000000be', fontSize: '0.9rem', marginBottom: '5px' }}>
                    &copy; {new Date().getFullYear()} Hivbnb. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;