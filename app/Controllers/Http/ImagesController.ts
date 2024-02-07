import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {
  imagesAddType,
  imagesUpdateType,
} from "../../../utils/types/imageEditType";
import Application from "@ioc:Adonis/Core/Application";
import Database from "@ioc:Adonis/Lucid/Database";
import { z } from "zod";
import fs from "fs";
import { allImages } from "../../functions/get_props_data";

export default class ImagesController {
  public async upload(ctx: HttpContextContract) {
    try {
      const imagesData = imagesAddType.parse({
        ...ctx.request.all(),
        image: ctx.request.file("image"),
      });
      var fileName = imagesData.title.replace(/\s/g, "_");
      const getSameName = await Database.rawQuery(
        `SELECT * from images WHERE name = "${fileName}"`
      );

      if (await getSameName[0].length) {
        fileName = `${Date.now()}${fileName}`;
      }

      try {
        imagesData.image!.move(Application.publicPath("images"), {
          name: fileName,
        });
        await Database.rawQuery(`
            INSERT INTO images (id, title, description, url, name) VALUES (NULL, "${imagesData.title}", "${imagesData.description}", "/images/${fileName}", "${fileName}")
            `);
        return ctx.response.redirect().back();
      } catch (error) {
        ctx.session.flash({
          errors:
            error instanceof z.ZodError
              ? JSON.parse(error.message)[0]?.message
              : error.message,
        });
        return ctx.response.redirect().back();
      }
    } catch (error) {
      ctx.session.flash({
        errors:
          error instanceof z.ZodError
            ? JSON.parse(error.message)[0]?.message
            : error.message,
      });
      return ctx.response.redirect().back();
    }
  }
  public async delete(ctx: HttpContextContract, link: string) {
    const url: string = link || ctx.request.only(["url"]).url;
    
    const filePath = Application.publicPath(url);
    try {
      fs.unlink(filePath, (err) => {
        if (err) throw new Error("Erreur lors de la suppression");
      });
      await Database.rawQuery(`DELETE from images WHERE url = "${url}"`);
      return ctx.response.status(200).json({
        images: (await allImages)[0],
      });
    } catch (error) {
      ctx.session.flash({
        errors:
          error instanceof z.ZodError
            ? JSON.parse(error.message)[0]?.message
            : error.message,
      });
      return ctx.response.redirect().back();
    }
  }

  public async update(ctx: HttpContextContract) {
    try {
      const imagesData = imagesUpdateType.parse({
        ...ctx.request.all(),
        image: ctx.request.file("image"),
      });

      if (imagesData.title || imagesData.description) {
        const updatedLine = await Database.rawQuery(
          `UPDATE images SET title = "${imagesData.title}", description = "${imagesData.description}" WHERE url = "${imagesData.old_url}"`
        );
        if (updatedLine[0].affectedRows > 0) {
          if (imagesData.image && imagesData.old_url) {
            this.delete(ctx, imagesData.old_url);
            this.upload(ctx);
          }

          return ctx.response.redirect().back();
        } else {
          ctx.session.flash({
            errors:
              "Une erreur est survenus lors de la mise à jour des données ",
          });
          return ctx.response.redirect().back();
        }
      } else {
        if (imagesData.image && imagesData.old_url) {
          this.delete(ctx, imagesData.old_url);
          this.upload(ctx);
        }
      }
    } catch (error) {
      ctx.session.flash({
        errors:
          error instanceof z.ZodError
            ? JSON.parse(error.message)[0]?.message
            : error.message,
      });
      return ctx.response.redirect().back();
    }
  }
}
