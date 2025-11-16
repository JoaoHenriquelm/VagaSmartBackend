import { GateEvent } from "../../entities/gateEvent";
import { prisma } from "../../services/prisma";
import { GateEventRepository } from "../gateEvent-repository";

export class SqliteGateEvent implements GateEventRepository {
  async findGateEventsPerUserId(userId: string): Promise<Array<GateEvent>> {
    const events = await prisma.gateEvent.findMany({
      where: { userId: userId },
      orderBy: { timestamp: "desc" },
    });

    return events.map((e) =>
      GateEvent.with({
        _id: e.id,
        userId: e.userId,
        vehicleId: e.vehicleId,
        type: e.type as "AUTO" | "MANUAL",
        timestamp: e.timestamp.getTime(),
        authorized: e.authorized ?? undefined,
        operatorId: e.operatorId ?? undefined,
        reason: e.reason ?? undefined,
      })
    );
  }

  async findGateEventsUnathorized(): Promise<Array<GateEvent>> {
    const events = await prisma.gateEvent.findMany({
      where: { authorized: null },
      orderBy: { timestamp: "desc" },
    });

    return events.map((e) =>
      GateEvent.with({
        _id: e.id,
        userId: e.userId,
        vehicleId: e.vehicleId,
        type: e.type as "AUTO" | "MANUAL",
        timestamp: e.timestamp.getTime(),
        authorized: e.authorized ?? undefined,
        operatorId: e.operatorId ?? undefined,
        reason: e.reason ?? undefined,
      })
    );
  }

  async store(gateEvent: GateEvent): Promise<void> {
    await prisma.gateEvent.create({
      data: {
        id: gateEvent.id,
        userId: gateEvent.userId,
        vehicleId: gateEvent.vehicleId,
        type: gateEvent.type as any,
        authorized: gateEvent.authorized,
        operatorId: gateEvent.operatorId,
        reason: gateEvent.reason,
      },
    });
  }

  async update(gateEvent: GateEvent): Promise<void> {
    await prisma.gateEvent.update({
      where: { id: gateEvent.id },
      data: {
        authorized: gateEvent.authorized,
        operatorId: gateEvent.operatorId,
        reason: gateEvent.reason,
      },
    });
  }
}
