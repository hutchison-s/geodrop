import {useParams} from 'react-router-dom';

export default function FullScreenContent() {
    const {id} = useParams();



    return (
        <>
            {id}
        </>
    )
}