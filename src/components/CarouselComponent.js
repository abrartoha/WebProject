import React from 'react';
import Carousel from 'react-material-ui-carousel';

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Button,
} from '@mui/material';


const Example = () => {
    return (
        <div style={{ marginTop: "20px"}}>
            <Carousel className="Example">
                {
                    items.map((item, index) => {
                        return <Banner item={item} key={index} contentPosition={item.contentPosition} />
                    })
                }
            </Carousel>
            <br/>
        </div>
    );
}

const Banner = (props) => {
    const contentPosition = props.contentPosition ? props.contentPosition : "left";
    const totalItems = props.length ? props.length : 3;
    const mediaLength = totalItems - 1;

    let items = [];
    const content = (
        <Grid item xs={4} key="content">
            <CardContent className="Content">
                <Typography className="Title">
                    {props.item.Name}
                </Typography>
                <Typography className="Caption">
                    {props.item.Caption}
                </Typography>
                <Button variant="outlined" className="ViewButton">
                    View Now
                </Button>
            </CardContent>
        </Grid>
    );

    for (let i = 0; i < mediaLength; i++) {
        const item = props.item.Items[i];

        const media = (
            <Grid item xs={4} key={item.Name}>
                <CardMedia
                    className="Media"
                    image={item.Image}
                    title={item.Name}
                >
                    <Typography className="MediaCaption">
                        {item.Name}
                    </Typography>
                </CardMedia>
            </Grid>
        );

        items.push(media);
    }

    if (contentPosition === "left") {
        items.unshift(content);
    } else if (contentPosition === "right") {
        items.push(content);
    } else if (contentPosition === "middle") {
        items.splice(items.length / 2, 0, content);
    }

    return (
        <Card raised className="Banner">
            <Grid container spacing={0} className="BannerGrid">
                {items}
            </Grid>
        </Card>
    );
}

const items = [
    {
        Name: "Cryptocurrencies",
        Caption: "The digital gold of the modern age!",
        contentPosition: "left",
        Items: [
            {
                Name: "Bitcoin",
                Image: "https://source.unsplash.com/featured/?bitcoin"
            },
            {
                Name: "Ethereum",
                Image: "https://source.unsplash.com/featured/?ethereum"
            }
        ]
    },
    {
        Name: "Digital Art",
        Caption: "Experience the revolution in art!",
        contentPosition: "middle",
        Items: [
            {
                Name: "Digital Painting",
                Image: "https://get.wallhere.com/photo/ai-art-landscape-digital-art-ocean-view-reflection-rocks-sunset-clouds-2223954.jpg"
            },
            {
                Name: "VR Art Gallery",
                Image: "https://source.unsplash.com/featured/?vr,artgallery"
            }
        ]
    },
    {
        Name: "Smart Contracts",
        Caption: "Automate trust with code!",
        contentPosition: "right",
        Items: [
            {
                Name: "Smart Contract Icon",
                Image: "https://builtin.com/cdn-cgi/image/f=auto,quality=80,width=752,height=435/https://builtin.com/sites/www.builtin.com/files/styles/byline_image/public/2022-08/contract-blockchain-smart-contracts-blockchain.png"
            },
            {
                Name: "Dapp Design",
                Image: "https://source.unsplash.com/featured/?dapp"
            }
        ]
    }
];

export default Example;
