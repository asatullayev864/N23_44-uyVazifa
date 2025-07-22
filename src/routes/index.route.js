import { Router } from "express";

import adminRouter from './admin.route.js';
import clientRouter from './client.route.js';
import categoryRouter from './category.route.js';
import courseVideosRouter from './course-videos.route.js';
import orderRouter from './order.route.js';
import ownerRouter from './owner-course.route.js';
import courseRouter from './course.route.js';


const router = Router();

router 
    .use('/admin', adminRouter)
    .use('/client', clientRouter)
    .use('/category', categoryRouter)
    .use('/courseVideos', courseVideosRouter)
    .use('/order', orderRouter)
    .use('/owner', ownerRouter)
    .use('/course', courseRouter)

export default router;