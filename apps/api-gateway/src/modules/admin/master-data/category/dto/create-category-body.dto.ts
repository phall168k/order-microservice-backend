import { OmitType } from "@nestjs/swagger";
import { CreateCategoryRequestDto } from "apps/product-service/src/category/dto/create-category-request.dto";

export class CreateCategoryBodyDto extends OmitType(CreateCategoryRequestDto, [
  "createdByUserId",
] as const) {}
