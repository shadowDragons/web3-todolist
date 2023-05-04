const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Todo", function () {
    let todo;
    let owner;
    let id = 1;

    before(async function () {
        [owner] = await ethers.getSigners();
        const Todo = await ethers.getContractFactory("Todo");
        todo = await Todo.deploy();
        await todo.deployed();
    });

    it("should add a todo", async function () {
        const tx = await todo.add(ethers.utils.formatBytes32String("Test todo"));
        const rc = await tx.wait();
        const event = rc.events.find(event => event.event === 'Add');
        const [sender, id, content] = event.args;
        expect(content).to.equal(ethers.utils.formatBytes32String("Test todo"));
    });


    it("should check a todo", async function () {
        const tx = await todo.checked(id);
        const rc = await tx.wait();
        const event = rc.events.find(event => event.event === 'Checked');
        expect(event.args.status).to.equal(1);
    });

    it("should delete a todo", async function () {
        const tx = await todo.del(id);
        const rc = await tx.wait();
        const event = rc.events.find(event => event.event === 'Del');
        expect(event.args.status).to.equal(2);
    });
});
