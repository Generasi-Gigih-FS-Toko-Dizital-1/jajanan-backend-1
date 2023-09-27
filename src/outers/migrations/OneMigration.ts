import type OneDatastore from '../datastores/OneDatastore'

export default class OneMigration {
  oneDatastore: OneDatastore

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  up = async (): Promise<void> => {

    console.log('One migration up.')
  }

  down = async (): Promise<void> => {

    console.log('One migration down.')
  }
}
