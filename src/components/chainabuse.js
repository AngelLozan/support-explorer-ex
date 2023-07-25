//@dev Checks against chain abuse. Replacement for hardcoded addresses.

import sdk from 'api';
sdk('@chainabuse/v1.2#fgz6kolixb6hz3');


const chainAbuse = async (_address) => {
    // @dev, these secrets have been rotated. Leaving for example. 
    //const auth = 'ca_eTJ3aFVFb3RsbGZ2d1M3dXIxS0d6dHF6Lk0yQVZoQUJCWVFvN0p1TTR6Z0RYN1E9PQ';
    const auth = 'Y2FfZVRKM2FGVkZiM1JzYkdaMmQxTTNkWEl4UzBkNmRIRjZMazB5UVZab1FVSkNXVkZ2TjBwMVRUUjZaMFJZTjFFOVBROmNhX2VUSjNhRlZGYjNSc2JHWjJkMU0zZFhJeFMwZDZkSEY2TGsweVFWWm9RVUpDV1ZGdk4wcDFUVFI2WjBSWU4xRTlQUQ==';
    const page = '1';
    const perPage = '50';

    try {
        fetch(`https://api.chainabuse.com/v1.2/reports?address=${_address}&page=${page}&perPage=${perPage}`, {
                headers: {
                    'authorization': `Basic ${auth}`
                }
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.error('Error was:', err));

    } catch (error) {
        return false;
    }
};

//export default chainAbuse;


// chainAbuse('TApC34YjvHY64xXhHYKUvjHEVQffeBYsno');
chainAbuse('14UTJBbtUsKxPtkf8WvGwWBpB4D6MmGqAk');


