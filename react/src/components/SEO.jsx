import {Helmet} from 'react-helmet-async';
import PropTypes from 'prop-types';

export default function SEO({title, desc, canon}) {
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={desc} />
                <link rel="canonical" href={`https://www.geodrop.xyz/${canon}`} />
            </Helmet>
        </>
    )
}

SEO.propTypes = {
    title: PropTypes.string,
    desc: PropTypes.string,
    canon: PropTypes.string
}