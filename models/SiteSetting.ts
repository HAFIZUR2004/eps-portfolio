import mongoose, { Schema, model, models } from 'mongoose';

const SiteSettingSchema = new Schema(
  {
    logoUrl: {
      type: String,
      default: '/logo2.png',
    },
  },
  { timestamps: true }
);

const SiteSetting = models.SiteSetting || model('SiteSetting', SiteSettingSchema);

export default SiteSetting;