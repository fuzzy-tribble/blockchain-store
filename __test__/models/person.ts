import { Document, model, Model, Schema } from "mongoose";

// Define interfaces for typescript (documnet, model, schema)
export interface IPerson {
  name: string;
  surname1: string;
  surname2: string;
  age: number;
}

export interface IPersonDoc extends IPerson, Document {
  getCompleteName(): string;
}

enum PropertyNames {
  NAME = "name",
  SURNNAME1 = "surname1",
  SURNNAME2 = "surname",
  AGE = "age",
}
const AGES = {
  KID: 0,
  YOUNG: 15,
  ADULT: 25,
  MIDDLE_AGE: 40,
  MAJOR: 60,
};

export interface IPersonModel extends Model<IPersonDoc> {
  findPeopleOlderThan(age: number): Promise<IPersonDoc[]>;
  propertyNames: typeof PropertyNames;
  ages: typeof AGES;
}

const PersonSchemaFields: Record<keyof IPerson, any> = {
  name: String,
  surname1: String,
  surname2: String,
  age: Number,
};

const PersonSchema = new Schema(PersonSchemaFields);

PersonSchema.methods.getCompleteName = function getCompleteName(): string {
  return `${this.name} ${this.surname1} ${this.surname2}`;
};

PersonSchema.static(
  "findPeopleOlderThan",
  async function findPeopleOlderThan(age: number): Promise<IPersonDoc[]> {
    const people: IPersonDoc[] = await this.find({ age: { $gte: age } });
    return people;
  }
);

// PersonSchema.statics.propertyNames = PropertyNames;
// PersonSchema.statics.ages = AGES;

export default model<IPersonDoc, IPersonModel>(
  "persons",
  PersonSchema,
  "persons"
);
